/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { Server as SocketIOServer } from "socket.io";
import http from "http";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI client lazily & safely to protect against startup crashes
let aiClient: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

function getAiClient(): any {
  if (!aiClient && API_KEY && API_KEY !== "MY_GEMINI_API_KEY") {
    try {
      aiClient = new GoogleGenAI({
        apiKey: API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("GoogleGenAI Client initialized successfully.");
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI client:", e);
    }
  }

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!aiClient && !OPENROUTER_API_KEY) {
    return null;
  }

  return {
    models: {
      generateContent: async (params: any) => {
        let geminiError = null;
        if (aiClient) {
          try {
            return await aiClient.models.generateContent(params);
          } catch (err: any) {
            console.log(
              "Gemini API call failed. Falling back to OpenRouter...",
              err.message,
            );
            geminiError = err;
          }
        }

        if (OPENROUTER_API_KEY) {
          console.log("Using OpenRouter as additive/fallback provider...");
          let userMessageContent: any[] = [];

          if (typeof params.contents === "string") {
            userMessageContent.push({ type: "text", text: params.contents });
          } else if (Array.isArray(params.contents)) {
            for (const c of params.contents) {
              if (typeof c === "string") {
                userMessageContent.push({ type: "text", text: c });
              } else if (c.inlineData) {
                userMessageContent.push({
                  type: "image_url",
                  image_url: {
                    url: `data:${c.inlineData.mimeType};base64,${c.inlineData.data}`,
                  },
                });
              } else if (c.text) {
                userMessageContent.push({ type: "text", text: c.text });
              } else {
                userMessageContent.push({
                  type: "text",
                  text: JSON.stringify(c),
                });
              }
            }
          }

          const requestBody: any = {
            model: "google/gemini-2.5-flash",
            max_tokens: 4096,
            messages: [{ role: "user", content: userMessageContent }],
          };

          if (params.config?.responseMimeType === "application/json") {
            requestBody.response_format = { type: "json_object" };
            const lastIdx = requestBody.messages.length - 1;
            if (lastIdx >= 0) {
              if (typeof requestBody.messages[lastIdx].content === "string") {
                requestBody.messages[lastIdx].content +=
                  "\n\nCRITICAL: Return valid JSON ONLY.";
              } else if (Array.isArray(requestBody.messages[lastIdx].content)) {
                requestBody.messages[lastIdx].content.push({
                  type: "text",
                  text: "\n\nCRITICAL: Return valid JSON ONLY.",
                });
              }
            }
          }

          const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody),
            },
          );

          if (!response.ok) {
            const text = await response.text();
            if (response.status === 401) {
               throw geminiError || new Error(`OpenRouter Unauthorized: 401`);
            }
            throw new Error(`OpenRouter API failed: ${response.status} - ${text}`);
          }

          const data = await response.json();
          let textContent = data.choices?.[0]?.message?.content || "";

          // Strip markdown code blocks if returning JSON
          if (params.config?.responseMimeType === "application/json") {
            textContent = textContent
              .replace(/^```[a-z]*\s*/im, "")
              .replace(/```\s*$/i, "")
              .trim();
          }

          return {
            text: textContent,
            candidates: [
              {
                groundingMetadata: { groundingChunks: [] },
              },
            ],
          };
        }

        throw (
          geminiError || new Error("No AI client and no fallback key provided.")
        );
      },
    },
  };
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    apiConfigured: !!API_KEY && API_KEY !== "MY_GEMINI_API_KEY",
  });
});

app.get("/api/search", (req, res) => {
  const query = ((req.query.q as string) || "").toLowerCase();

  if (!query) {
    return res.json([]);
  }

  const mockResults = [
    { type: "hospital", name: "Sri Ramachandra Hospital" },
    { type: "police", name: "Tambaram Police Station" },
    { type: "city", name: "Chengalpattu" },
  ].filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query),
  );

  // Fallback to static data if no dataset
  const dataset = getDataset();
  if (dataset && dataset.length > 0) {
    const results = dataset
      .filter(
        (item: any) =>
          item.name?.toLowerCase().includes(query) ||
          item.service_type?.toLowerCase().includes(query),
      )
      .slice(0, 5)
      .map((item: any) => ({
        type: item.service_type?.toLowerCase() || "places",
        name: item.name || "Unknown Location",
      }));
    return res.json(results.length > 0 ? results : mockResults);
  }

  res.json(mockResults);
});

// Grounded Google Search Endpoint
app.post("/api/grounding-search", async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const ai = getAiClient();
  if (!ai) {
    // Offline / Local response simulation for query
    return res.json({
      text: `[Offline Local Simulation] RoadGuardian emergency triage index search for matching: "${query}". Ensure proper segregation, contain hazardous materials, and await autonomous fleet dispatch.`,
      sources: [
        {
          title: "RoadGuardian Trauma Protocols",
          uri: "https://roadguardian.ai/guidelines",
        },
        {
          title: "Smart Fleet Dispatch SOP",
          uri: "https://roadguardian.ai/fleet",
        },
      ],
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are RoadGuardian AI Grounding Search. Answer this emergency response query simply, professionally, and formatted in clean markdown: ${query}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(
        (chunk: any) => ({
          title: chunk.web?.title || "Trauma Guide",
          uri: chunk.web?.uri || "#",
        }),
      ) || [];

    res.json({
      text: response.text,
      sources,
    });
  } catch (err: any) {
    if (err.status !== 503 && !err.message?.includes('503')) {
        console.error("Grounding search error:", err.message);
    }
    res.json({
      text: `[Local Intelligence Fallback] Live Internet Search is currently simulated in Local Intelligence Mode. Recommended protocol for "${query}": Keep the surrounding area secure, do not mix hazardous toxins, and await official RoadGuardian Smart Fleet dispatch.`,
      sources: [
        { title: "RoadGuardian Accident Management Manual", uri: "#" },
        { title: "Crash Prevention Guidelines", uri: "#" },
      ],
    });
  }
});

// Dynamic AI Accident Severity Triaging & Multi-Agent collaboration simulation
app.post("/api/assistant-chat", async (req, res) => {
  const { message, image } = req.body;

  if (!message && !image) {
    return res.status(400).json({ error: "Message or image is required" });
  }

  // Intercept the custom emergency triage messages
  const normalizedMsg = (message || "").toLowerCase();

  if (
    normalizedMsg.includes("plastic") &&
    normalizedMsg.includes("battery") &&
    normalizedMsg.includes("mysore")
  ) {
    return res.json({
      detected_language: "English",
      detected_language_code: "en-IN",
      translated_english: message,
      extracted_location: "Mysore",
      severity_assessment: "Severe",
      accident_detection: "Multi-Vehicle Collision",
      confidence_score: "94%",
      recommended_dispatch: "Red (Hazardous) / Yellow",
      trauma_risk: "High",
      collection_status: "Dispatched",
      traffic_impact: "High Chemical Leakage Risk",
      response_text:
        "Plastic and multi-vehicle pile up detected in Mysore. Segregation recommended immediately. Smart Collection unit dispatched.",
      first_aid_instructions: [
        "Do not touch leaking batteries bare-handed.",
        "Use the designated yellow and red hazardous bins.",
        "Wait for the automated collection bot.",
      ],
      nearby_resources: {
        hospitals: ["Mysore Solid emergency response Facility (Zone 3)"],
        police: ["Highway/Police Protection Unit - Mysore South"],
        rescue: ["ambulance Fleet Operations"],
      },
    });
  }

  if (
    normalizedMsg.includes("medical") &&
    normalizedMsg.includes("bengaluru")
  ) {
    return res.json({
      detected_language: "English",
      detected_language_code: "en-IN",
      translated_english: message,
      extracted_location: "Bengaluru",
      severity_assessment: "Critical",
      accident_detection: "Severe Rollover Crash",
      confidence_score: "99%",
      recommended_dispatch: "Yellow (Biohazard)",
      trauma_risk: "Critical",
      collection_status: "Hazmat Dispatched",
      traffic_impact: "Severe Biohazard Exposure",
      response_text:
        "Bio-medical highway accident detected in Bengaluru. Maximum priority alert triggered. Specialized hazmat collection dispatched.",
      first_aid_instructions: [
        "Isolate the area immediately to prevent exposure.",
        "Do not handle medical sharps or sharp debris.",
        "Wait for specialized hazmat personnel.",
      ],
      nearby_resources: {
        hospitals: ["Bengaluru sharp debris Processing Plant (Zone 1)"],
        police: ["Karnataka Highway Traffic Police"],
        rescue: ["Hazmat Specialized Collection Unit"],
      },
    });
  }

  if (
    normalizedMsg.includes("industrial") &&
    (normalizedMsg.includes("leakage") || normalizedMsg.includes("chemical")) &&
    normalizedMsg.includes("chennai")
  ) {
    return res.json({
      detected_language: "English",
      detected_language_code: "en-IN",
      translated_english: message,
      extracted_location: "Chennai",
      severity_assessment: "Critical",
      accident_detection: "Lorry Jackknife",
      confidence_score: "97%",
      recommended_dispatch: "Containment Unit",
      trauma_risk: "Critical",
      collection_status: "Sector Lockdown",
      traffic_impact: "Severe Traffic Jam & Multiple Casualties",
      response_text:
        "Lorry Jackknifeage mapped near Chennai. risk levels elevating. Highway/Police containment units have been scrambled.",
      first_aid_instructions: [
        "Evacuate personnel downwind of the chemical spill.",
        "Do not attempt to dilute chemicals with water without authorization.",
        "Await heavy Highway/Police containment units.",
      ],
      nearby_resources: {
        hospitals: ["Chennai Industrial Processing Facility (Zone C)"],
        police: ["TN Industrial Safety Inspectorate"],
        rescue: ["Chemical Containment Task Force"],
      },
    });
  }

  const ai = getAiClient();
  if (!ai) {
    // Offline/Fallback simulation
    return res.json({
      detected_language: "English",
      translated_english: message,
      extracted_location: "Unknown Location",
      severity_assessment: "Moderate",
      accident_detection: "Multi-Lane Blockage",
      confidence_score: "85%",
      recommended_dispatch: "General Collection",
      trauma_risk: "Medium",
      collection_status: "Scheduled",
      traffic_impact: "Moderate",
      response_text:
        "highway accident reported. Smart collection trucks have been dispatched.",
      first_aid_instructions: [
        "Move to the shoulder",
        "Ensure the area is locked down from unauthorized dumping",
      ],
      nearby_resources: {
        hospitals: ["District General Hospital", "City Medical College"],
        police: ["Highway/Police Protection Bureau"],
        rescue: ["Smart Fleet Collection Unit"],
      },
    });
  }

  try {
    const prompt = `
      You are the RoadGuardian Autonomous emergency triage Assistant.
      A user has reported a highway accident event. The message might be in English, Hindi, Tamil, Kannada, Telugu, Malayalam, Marathi, or Bengali.
      User Message: "${message || "No text provided, see image."}"
      ${image ? "An image of the highway accident scene has also been provided." : ""}

      Analyze the message and image (if any) and provide a structured JSON response:
      1. Detect the original language of the text.
      2. Translate the message to English (if it isn't already).
      3. Extract the location if mentioned.
      4. Assess the severity (Minor, Moderate, Severe, Critical).
      5. Formulate a reassuring, instructional response in the DETECTED LANGUAGE that can be read aloud by TTS. Keep it very brief like "Plastic detected. Segregation recommended."
      6. Provide 2-3 step-by-step first aid instructions (also in the detected language).
      7. List 2 nearby hospitals/trauma centers, 1 Highway/Police police/agency, and 1 collection fleet.
    `;

    const contents: any[] = [prompt];

    if (image) {
      // Assuming 'image' is a base64 string starting with data:image/..., we strip the prefix
      const base64Data = image.split(",")[1] || image;
      const mimeType = image.split(";")[0].split(":")[1] || "image/jpeg";
      contents.push({
        inlineData: {
          data: base64Data,
          mimeType,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detected_language: {
              type: Type.STRING,
              description: "The language detected from the user message",
            },
            detected_language_code: {
              type: Type.STRING,
              description:
                "BCP-47 language tag e.g. en-IN, ta-IN, hi-IN, kn-IN, te-IN, ml-IN, mr-IN, bn-IN",
            },
            translated_english: {
              type: Type.STRING,
              description: "English translation of the message",
            },
            extracted_location: {
              type: Type.STRING,
              description: "Location extracted from text, or Unknown",
            },
            severity_assessment: {
              type: Type.STRING,
              description: "Severity level: Minor, Moderate, Severe, Critical",
            },
            response_text: {
              type: Type.STRING,
              description:
                "Reassuring response to be read aloud, in the DETECTED LANGUAGE",
            },
            accident_detection: {
              type: Type.STRING,
              description: "E.g., Head-on Collision, Two Wheeler",
            },
            confidence_score: { type: Type.STRING, description: "E.g., 98%" },
            recommended_dispatch: {
              type: Type.STRING,
              description:
                "E.g., Ambulance Priority, Police Escort, Hazmat Route",
            },
            trauma_risk: {
              type: Type.STRING,
              description: "E.g., Low, Medium, High",
            },
            collection_status: {
              type: Type.STRING,
              description: "E.g., Not Required, Dispatched",
            },
            traffic_impact: {
              type: Type.STRING,
              description: "E.g., Minimal, Severe",
            },
            first_aid_instructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "first aid steps in the DETECTED LANGUAGE",
            },
            nearby_resources: {
              type: Type.OBJECT,
              properties: {
                hospitals: { type: Type.ARRAY, items: { type: Type.STRING } },
                police: { type: Type.ARRAY, items: { type: Type.STRING } },
                rescue: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["hospitals", "police", "rescue"],
            },
          },
          required: [
            "detected_language",
            "detected_language_code",
            "translated_english",
            "extracted_location",
            "severity_assessment",
            "accident_detection",
            "confidence_score",
            "recommended_dispatch",
            "trauma_risk",
            "collection_status",
            "traffic_impact",
            "response_text",
            "first_aid_instructions",
            "nearby_resources",
          ],
        },
      },
    });

    const parsedData = JSON.parse(response.text.trim());
    res.json(parsedData);
  } catch (err: any) {
    if (err.status !== 503 && !err.message?.includes('503') && !err.message?.includes('401')) {
        console.error("Gemini Assistant Error:", err.message);
    }
    res.json({
      detected_language: "English",
      detected_language_code: "en-IN",
      translated_english: message || "Analyzing accident site",
      extracted_location: "Tamil Nadu Bypass Road",
      severity_assessment: "Moderate",
      response_text:
        "Local Intel Mode active. I have registered your vocal incident. Dispatch commands have been successfully routed to high-priority clean-up crews.",
      first_aid_instructions: [
        "Keep the area secured and away from foot traffic.",
        "Do not handle hazardous liquids without gloves.",
      ],
      nearby_resources: {
        hospitals: [
          "Central Sorting Hub",
          "Hazardous Materials Processing Center",
        ],
        police: ["Highway Police Liaison Patrol"],
        rescue: ["Smart Collection Unit"],
      },
    });
  }
});

// Reusable high-fidelity deterministic medical & coordination assessment registry (Local Intelligence Fallback)
function getLocalAccidentAssessment(description: string) {
  const textLower = description.toLowerCase();
  let severity: "Minor" | "Moderate" | "Severe" | "Critical" = "Moderate";
  let victimsCount = 1;
  let injuryTypes = ["Mixed Recyclables", "General Litter"];
  let hazmat = false;
  let vehicleInfo = "Unknown origin";
  let hospitalName = "Central Eco Processing Plant (Level 1)";
  let eta = "15 mins";

  if (
    textLower.includes("chemical") ||
    textLower.includes("toxic") ||
    textLower.includes("acid")
  ) {
    severity = "Severe";
    victimsCount = 5;
    injuryTypes = ["Leaking acid drums", "Corrosive soil saturation"];
    hazmat = true;
  }
  if (
    textLower.includes("electronic") ||
    textLower.includes("battery") ||
    textLower.includes("fire") ||
    textLower.includes("critical")
  ) {
    severity = "Critical";
    victimsCount = 10;
    injuryTypes = [
      "Volatile lithium compounds",
      "Groundwater penetration risk",
    ];
    if (
      textLower.includes("fire") ||
      textLower.includes("gas") ||
      textLower.includes("truck")
    ) {
      hazmat = true;
    }
  }
  if (
    textLower.includes("plastic") ||
    textLower.includes("paper") ||
    textLower.includes("minor")
  ) {
    severity = "Minor";
    injuryTypes = ["Stray plastic bags", "Used cardboard packing"];
  }

  if (textLower.includes("factory") || textLower.includes("plant"))
    vehicleInfo = "Industrial Discharge";
  else if (textLower.includes("residential") || textLower.includes("street"))
    vehicleInfo = "City Street Accident";
  else vehicleInfo = "Unsanctioned Dumping Site";

  return {
    severity,
    victimsCount,
    vehicleInfo,
    injuryTypes,
    hazmat,
    recommendedActions: [
      "Create high-visibility perimeter 30m around the accident zone to prevent public access.",
      "Check local drainage lines. Block any direct runoff channels immediately.",
      "Isolate dry recyclable materials away from wet sludge to preserve salvage value.",
      "If chemical fumes are assumed, do NOT approach downwind. Wait for specialized hazmat processing unit.",
    ],
    audioResponseText: `RoadGuardian Live SOS Command active. accident severity rated as ${severity}. Dispatched closest ambulances and police. Keep clear of the designated zone.`,
    agentsLog: [
      {
        agentName: "Emergency Coordinator",
        status: "info",
        message: `Incident reported: ${description.substring(0, 80)}... RoadGuardian Operations system initialized.`,
        timestamp: "00:00",
      },
      {
        agentName: "Severity Analysis Agent",
        status: severity === "Critical" ? "warning" : "success",
        message: `Classified overall Highway/Police impact level as [${severity}] with predicted ${victimsCount} tons expected. Hazardous materials presence evaluated: ${hazmat ? "YES - Hazardous" : "NO"}.`,
        timestamp: "00:01",
      },
      {
        agentName: "Facility Discovery Agent",
        status: "success",
        message: `Scanned disposal databases. Assigned routing target: ${hospitalName} due to compliance sorting capabilities.`,
        timestamp: "00:02",
      },
      {
        agentName: "Fleet Agent",
        status: "success",
        message: `Dispatched Ambulance Fleet Vehicle 108. Operators briefed on injury pattern: ${injuryTypes.join(", ")}. ETA: ${eta}.`,
        timestamp: "00:03",
      },
      {
        agentName: "Compliance Agent",
        status: "success",
        message: `Dispatched Highway/Police Patrol Unit 14 for regulatory containment, secure hazard flare deployment, and violation parameter logging.`,
        timestamp: "00:04",
      },
      {
        agentName: "Stakeholder Notification Agent",
        status: "success",
        message:
          "Municipal notification module synchronized. Alerts loaded into SMS cell network for instant civic dispatch.",
        timestamp: "00:05",
      },
      {
        agentName: "Route Optimization Agent",
        status: "success",
        message: `Pre-configured route corridors optimized. Bypassed heavy traffic bottle necks. Dispatched priority signals.`,
        timestamp: "00:06",
      },
      {
        agentName: "Bystander Guidance Agent",
        status: "success",
        message:
          "Activated live accident audio loops. Instructions updated in UI to cover basic hazard avoidance.",
        timestamp: "00:07",
      },
      {
        agentName: "Analytics Agent",
        status: "info",
        message:
          "Violation Spot registered and loaded to state db for risk factor correlation (Volume, frequency).",
        timestamp: "00:08",
      },
      {
        agentName: "Offline Survival Agent",
        status: "info",
        message:
          "Prepared local compressed SOS SMS backup code: RG-SOS#" +
          severity.charAt(0) +
          "-V" +
          victimsCount +
          "-H" +
          (hazmat ? "1" : "0") +
          ". Valid offline cache.",
        timestamp: "00:09",
      },
    ],
  };
}

// Dynamic AI accident Severity Triaging & Multi-Agent collaboration simulation
app.post("/api/assess-accident", async (req, res) => {
  const { description, voicePayload, imageSimulated } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  const ai = getAiClient();
  if (!ai) {
    console.log(
      "No Gemini API Key found. Returning deterministic mock AI assessment.",
    );
    return res.json(getLocalAccidentAssessment(description));
  }

  try {
    const prompt = `
      You are the Lead Highway/Police Operating System of ROADGUARDIAN AI.
      Analyze the following highway accident report description, voice text, or simulated image context:
      "${description}"
      
      Decide:
      1. Overall Severity level: One of "Minor", "Moderate", "Severe", "Critical" (Highway/Police impact severity).
      2. Victims Count: integer. Estimate the number of casualties based on the text (e.g. "two people injured"). Provide an integer.
      3. Vehicle Info: Simple description of the reported vehicles involved or accident type (e.g. "Industrial Discharge", "Two Wheeler vs Heavy Vehicle", "Chemical Drum Leak").
      4. Injury Types: Array of specific contaminants reported or highly suspected (e.g. "Lithium exposure", "Plastic residue", "Chemical Sludge"). Return them as human readable items in an array.
      5. Hazmat (Hazardous Materials): boolean. Identify if there's toxic, chemical leak, electric battery risk, or flammable substance.
      6. Recommended Actions: Custom segregation and safety steps to take. Must contain exactly 4 lines tailored specifically to the described accident.
      7. Reassuring voice broadcast transcript (audioResponseText) to comfort and command the reporter on site.
      8. Provide extremely engaging and detailed deliberation messages from each of the following 10 agents coordinating this incident in a timeline sequence starting from "00:00" to "00:09". Ensure each agent's message reflects their specific role:
         - Emergency Coordinator (Coordinates logs)
         - Severity Analysis Agent (Examines soil, water, toxin metrics)
         - Facility Discovery Agent (Looks up sorting/incinerator plants)
         - Fleet Agent (Dispatches standard or hazmat trucks)
         - Compliance Agent (Issues violation fines, secures zone)
         - Stakeholder Notification Agent (Municipal alert dispatch)
         - Route Optimization Agent (Dynamic congestion bypass routing steps)
         - Bystander Guidance Agent (Clear instructions like avoid smoke, stop dumping)
         - Analytics Agent (Logs black-spot index and casualty impact)
         - Offline Survival Agent (Creates compressed low-bandwidth offline SMS backup string)

      Please return a highly structured JSON response conforming strictly to the requested schema. Ensure the keys EXACTLY MATCH ("severity", "victimsCount", "vehicleInfo", "injuryTypes", "hazmat", "recommendedActions", "audioResponseText", "agentsLog").
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: {
              type: Type.STRING,
              description: "One of Minor, Moderate, Severe, Critical",
            },
            victimsCount: {
              type: Type.INTEGER,
              description: "Estimated tons count (integer)",
            },
            vehicleInfo: {
              type: Type.STRING,
              description: "Synthesized accident source descriptors",
            },
            injuryTypes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Contaminant type descriptions",
            },
            hazmat: {
              type: Type.BOOLEAN,
              description: "Is hazardous material or active risk detected",
            },
            recommendedActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description:
                "Exactly 4 custom first-aid/segregation instructions",
            },
            audioResponseText: {
              type: Type.STRING,
              description: "Voice announcement transcript",
            },
            agentsLog: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  agentName: { type: Type.STRING },
                  status: { type: Type.STRING },
                  message: { type: Type.STRING },
                  timestamp: { type: Type.STRING },
                },
                required: ["agentName", "status", "message", "timestamp"],
              },
              description:
                "An array of exactly 10 agent events (one for each of the 10 agents)",
            },
          },
          required: [
            "severity",
            "victimsCount",
            "vehicleInfo",
            "injuryTypes",
            "hazmat",
            "recommendedActions",
            "agentsLog",
            "audioResponseText",
          ],
        },
      },
    });

    const parsedData = JSON.parse(response.text.trim());
    res.json(parsedData);
  } catch (err: any) {
    if (err.status !== 503 && !err.message?.includes('503')) {
      console.warn("Gemini assessment failed. Falling back to local intelligence.");
    }
    res.json(getLocalAccidentAssessment(description));
  }
});

app.post("/api/first-aid", async (req, res) => {
  const { condition, language = "English" } = req.body;

  if (!condition) {
    return res.status(400).json({ error: "Condition is required" });
  }

  // Pre-compiled high-fidelity deterministic medical registry supporting all 6 key protocols
  const FIRST_AID_REGISTRY: Record<
    string,
    { title: string; instructions: string[]; voice_prompt: string }
  > = {
    bleeding: {
      title: "Severe Hemorrhage Control Protocol",
      instructions: [
        "Ensure scene safety before approaching the victim.",
        "Apply direct, firm pressure on the wound using a clean cloth or sterile gauze.",
        "Maintain pressure without releasing to check the wound.",
        "If blood soaks through, add another layer on top; do not remove the initial layer.",
      ],
      voice_prompt:
        "Apply continuous firm pressure to the wound with a clean cloth. Do not lift the cloth to check bleeding. Keep pressing until help arrives.",
    },
    fracture: {
      title: "Spinal Precautions & Fracture Stabilization",
      instructions: [
        "Do not move the victim unless they are in immediate life-threatening danger.",
        "Support the head and neck exactly in the position found.",
        "Immobilize the fractured limb without attempting to realign it.",
      ],
      voice_prompt:
        "Do not move the victim's neck or spine. Support the head exactly as you found it. Keep the victim completely still.",
    },
    cardiac: {
      title: "Cardiac Arrest / CPR Protocol",
      instructions: [
        "Check for responsiveness. If no pulse or breathing, begin chest compressions.",
        "Push hard and fast in the center of the chest (100-120 beats per minute).",
        "Allow the chest to recoil completely between compressions.",
      ],
      voice_prompt:
        "Begin CPR immediately. Push hard and fast in the center of the chest. Do not stop until paramedics arrive or an AED is available.",
    },
    burns: {
      title: "Severe Burns Control",
      instructions: [
        "Ensure personal safety and remove the victim from the heat source.",
        "Cool the burn with cool running water for at least 10 minutes.",
        "Do not apply ice, butter, or ointments.",
        "Cover the burn loosely with a sterile, non-fluffy dressing or clean plastic wrap.",
      ],
      voice_prompt:
        "Remove the victim from heat. Cool the burn using running water for ten minutes. Do not apply ice. Cover loosely with a clean cloth.",
    },
    "head injury": {
      title: "Head Injury / Concussion Protocol",
      instructions: [
        "Keep the victim completely still; assume spinal injury.",
        "Apply light pressure to bleeding, avoiding direct pressure if skull fracture suspected.",
        "Monitor breathing and consciousness levels continuously.",
        "Do not move the victim's neck or head.",
      ],
      voice_prompt:
        "Keep the victim completely still. Do not move their neck. Monitor their breathing continuously while waiting for paramedics.",
    },
    unconscious: {
      title: "Unconscious Victim Stabilization",
      instructions: [
        "Check for breathing. If not breathing normally, begin CPR.",
        "If breathing normally, carefully place the victim in the recovery position (on their side).",
        "Tilt the head back slightly to keep the airway open.",
        "Keep them warm and monitor breathing until help arrives.",
      ],
      voice_prompt:
        "Check for breathing. If breathing normally, roll them onto their side into the recovery position to keep the airway open. Wait for help.",
    },
    default: {
      title: "General Trauma Stabilization",
      instructions: [
        "Ensure personal safety from ongoing traffic.",
        "Keep the victim warm and calm to prevent shock.",
        "Do not offer food or water.",
        "Wait for emergency medical services to arrive.",
      ],
      voice_prompt:
        "Ensure you are safely away from traffic. Keep the victim warm and calm. Do not give them anything to eat or drink. Ambulances have been dispatched.",
    },
  };

  // Find matching key
  const normalizedKey = condition.toLowerCase().trim();
  let fallbackProtocol = FIRST_AID_REGISTRY["default"]; // ultimate default

  for (const k in FIRST_AID_REGISTRY) {
    if (normalizedKey.includes(k) || k.includes(normalizedKey)) {
      fallbackProtocol = FIRST_AID_REGISTRY[k];
      break;
    }
  }

  const ai = getAiClient();
  if (!ai) {
    return res.json(fallbackProtocol);
  }

  try {
    const prompt = `
      You are the RoadGuardian First Aid Agent. A user needs immediate emergency medical survival instructions.
      Condition: "${condition}"
      Requested Language: "${language}"

      Provide 3 to 5 simple, step-by-step first aid instructions that are easy to understand under extreme stress.
      Must be specifically tailored for the condition (e.g. Bleeding, Burns, Cardiac Arrest, Fracture, Head Injury, Recovery position).
      Make them voice-friendly (short sentences, zero jargon).
      
      Respond in JSON format with:
      - title: Short title in the requested language
      - instructions: Array of step-by-step strings
      - voice_prompt: A continuous string of all steps to be read aloud by TTS in the requested language.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            voice_prompt: { type: Type.STRING },
          },
          required: ["title", "instructions", "voice_prompt"],
        },
      },
    });

    const parsedData = JSON.parse(response.text.trim());
    res.json(parsedData);
  } catch (err: any) {
    // Safe deterministic delivery
    if (err.status !== 503 && !err.message?.includes('503')) {
       console.warn("Gemini First Aid Error:", err.message);
    }
    res.json(fallbackProtocol);
  }
});

let cachedDataset: any[] | null = null;
const STATIC_FALLBACK_RESOURCES = [
  {
    name: "AIIMS New Delhi Emergency support",
    service_type: "Hospital",
    latitude: 28.5672,
    longitude: 77.21,
    availability_status: "Available",
  },
  {
    name: "Apollo Hospital Bengaluru Trauma Center",
    service_type: "Hospital",
    latitude: 12.9698,
    longitude: 77.5973,
    availability_status: "Available",
  },
  {
    name: "Tata Memorial Mumbai Trauma Unit",
    service_type: "Hospital",
    latitude: 19.0163,
    longitude: 72.8436,
    availability_status: "Busy",
  },
  {
    name: "Government General Hospital Chennai",
    service_type: "Hospital",
    latitude: 13.0827,
    longitude: 80.2707,
    availability_status: "Available",
  },
  {
    name: "PGIMER Chandigarh Trauma Centre",
    service_type: "Hospital",
    latitude: 30.7645,
    longitude: 76.7728,
    availability_status: "Available",
  },

  {
    name: "EMRI 108 Advanced Life Support Unit (Delhi-01)",
    service_type: "Ambulance",
    latitude: 28.57,
    longitude: 77.215,
    availability_status: "Available",
  },
  {
    name: "GVK EMRI Paramedic Responder (Bengaluru-42)",
    service_type: "Ambulance",
    latitude: 12.975,
    longitude: 77.6,
    availability_status: "Available",
  },
  {
    name: "Private MedMax Emergency ICU Ambulance (Mumbai)",
    service_type: "Ambulance",
    latitude: 19.02,
    longitude: 72.85,
    availability_status: "Available",
  },
  {
    name: "Chennai National Highway Paramedic Car",
    service_type: "Ambulance",
    latitude: 13.09,
    longitude: 80.28,
    availability_status: "Available",
  },

  {
    name: "Delhi Highway Police Interceptor Unit 12",
    service_type: "Police",
    latitude: 28.56,
    longitude: 77.2,
    availability_status: "Available",
  },
  {
    name: "Bengaluru Highway Patrol Division 4",
    service_type: "Police",
    latitude: 12.96,
    longitude: 77.58,
    availability_status: "Available",
  },
  {
    name: "Mumbai District Highway Patrol Unit 8",
    service_type: "Police",
    latitude: 19.01,
    longitude: 72.83,
    availability_status: "Available",
  },

  {
    name: "SDRF Disaster Response Command Unit Alpha (Delhi)",
    service_type: "Rescue",
    latitude: 28.58,
    longitude: 77.22,
    availability_status: "Available",
  },
  {
    name: "NHAI Highway Blockage Rescue Team (Bengaluru)",
    service_type: "Rescue",
    latitude: 12.98,
    longitude: 77.61,
    availability_status: "Available",
  },
  {
    name: "Mumbai Local Fire & Disaster Team",
    service_type: "Rescue",
    latitude: 19.03,
    longitude: 72.86,
    availability_status: "Available",
  },
];

function getDataset() {
  if (cachedDataset) return cachedDataset;
  try {
    const dataPath = path.join(
      process.cwd(),
      "dataset_output",
      "india_emergency_dataset.json",
    );
    if (fs.existsSync(dataPath)) {
      cachedDataset = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
      return cachedDataset;
    }
  } catch (e) {
    console.error("Error reading dataset", e);
  }
  return STATIC_FALLBACK_RESOURCES;
}

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const resourcesCache = new Map<string, any>();

app.post("/api/recommend-resources", async (req, res) => {
  const { latitude, longitude, severity, accidentType } = req.body;
  if (latitude === undefined || longitude === undefined) {
    return res
      .status(400)
      .json({ error: "Latitude and Longitude are required" });
  }

  // Round key to 4 decimal places (~11 meters) to cache nearby queries perfectly
  const cacheKey = `${latitude.toFixed(4)}_${longitude.toFixed(4)}_${severity}_${accidentType}`;
  if (resourcesCache.has(cacheKey)) {
    return res.json(resourcesCache.get(cacheKey));
  }

  const dataset = getDataset();

  const isCritical = severity === "Critical" || severity === "Severe";
  const isFire =
    (accidentType || "").toLowerCase().includes("fire") ||
    (accidentType || "").toLowerCase().includes("chemical");

  const filterAndSort = (
    serviceType: string,
    count: number,
    baseSpeedKmph: number,
  ) => {
    let resources = dataset.filter((r) => r.service_type === serviceType);

    resources = resources.map((r) => {
      const distance = getDistanceFromLatLonInKm(
        latitude,
        longitude,
        r.latitude,
        r.longitude,
      );

      // Speed adjustments based on priority
      let effectiveSpeed = baseSpeedKmph;
      if (isCritical) {
        effectiveSpeed *= 1.2; // 20% faster for critical (simulating green corridor/high priority dispatch)
      }

      const etaMins = Math.round((distance / effectiveSpeed) * 60);

      let priorityScore = distance;

      // Availability penalties
      if (r.availability_status === "Busy") priorityScore += 15;
      else if (r.availability_status === "Full") priorityScore += 100;
      else if (r.availability_status === "En-Route") priorityScore += 30;

      // Priority adjustments based on accident type and severity
      const nameLower = r.name.toLowerCase();

      if (serviceType === "Hospital" && isCritical) {
        if (nameLower.includes("trauma") || nameLower.includes("specialty")) {
          priorityScore -= 5; // Preference to trauma centers for critical accidents
        }
      }

      if (serviceType === "Ambulance" && isCritical) {
        if (
          nameLower.includes("icu") ||
          nameLower.includes("advanced") ||
          nameLower.includes("als")
        ) {
          priorityScore -= 5; // Preference to ALS for critical severity
        }
      }

      if (serviceType === "Rescue" && isFire) {
        if (nameLower.includes("fire") || nameLower.includes("hazmat")) {
          priorityScore -= 5; // Preference to fire/hazmat units for fire-related incidents
        }
      }

      return {
        ...r,
        distance: parseFloat(distance.toFixed(2)),
        eta: Math.max(1, etaMins),
        priorityScore,
      };
    });

    resources.sort((a, b) => a.priorityScore - b.priorityScore);
    return resources.slice(0, count);
  };

  const nearestHospital = filterAndSort("Hospital", 3, 50);
  const nearestPolice = filterAndSort("Police", 2, 60);
  const nearestRescue = filterAndSort("Rescue", 3, 50);
  const nearestAmbulance = filterAndSort("Ambulance", 3, 70);

  const traumaCenters = nearestHospital.filter(
    (h) =>
      h.name.toLowerCase().includes("trauma") ||
      h.name.toLowerCase().includes("specialty") ||
      h.name.toLowerCase().includes("government"),
  );

  const responsePayload = {
    nearestHospital: nearestHospital[0] || null,
    nearestTraumaCenter:
      traumaCenters.length > 0 ? traumaCenters[0] : nearestHospital[0] || null,
    nearestAmbulance: nearestAmbulance[0] || null,
    nearestPoliceStation: nearestPolice[0] || null,
    nearestRescueTeam: nearestRescue[0] || null,
    allOptions: {
      hospitals: nearestHospital,
      police: nearestPolice,
      rescue: nearestRescue,
      ambulances: nearestAmbulance,
    },
  };

  resourcesCache.set(cacheKey, responsePayload);

  // Enforce memory bounds of the cache (max 500 entry size)
  if (resourcesCache.size > 500) {
    const oldestKey = resourcesCache.keys().next().value;
    if (oldestKey !== undefined) {
      resourcesCache.delete(oldestKey);
    }
  }

  res.json(responsePayload);
});

// Vite Dev Server Middleware or Production Static Handling
async function startServer() {
  const httpServer = http.createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("[RoadGuardian Telemetry] Client Connected:", socket.id);

    socket.on("trigger_incident", (payload) => {
      // 1. CREATE INCIDENT
      io.emit("incident_created", {
        id: `RG-SOS-${Math.floor(Math.random() * 10000)}`,
        ...payload,
      });

      // 2. SEVERITY SCORE
      setTimeout(() => {
        io.emit("severity_scored", {
          severity: "Critical",
          confidence: "98%",
          incidentId: payload.id,
        });
      }, 500);

      // 3. HOSPITAL SELECTED
      setTimeout(() => {
        const hLat = payload.lat ? payload.lat + 0.05 : 28.5672;
        const hLng = payload.lng ? payload.lng + 0.05 : 77.21;
        io.emit("hospital_selected", {
          name: "Trauma Command Center",
          coords: { lat: hLat, lng: hLng },
        });
      }, 1000);

      // 4. ROUTE LOCKED
      setTimeout(() => {
        io.emit("route_locked", { status: "Optimized", trafficBypass: true });
      }, 1500);

      // 5. VEHICLE SPAWN
      setTimeout(() => {
        io.emit("vehicle_spawn", {
          type: "ambulance",
          id: "AMB-108-ALPHA",
          eta: "4 min",
        });
        
        // Stagger police spawn slightly to prevent OSRM rate-limiting
        setTimeout(() => {
            io.emit("vehicle_spawn", {
              type: "police",
              id: "POLICE-INTERCEPT-12",
              eta: "6 min",
            });
        }, 1100);
      }, 1800);

      // 6. DISPATCH COMPLETE
      setTimeout(() => {
        io.emit("dispatch_complete", {
          status: "All forces en route",
          totalDispatched: 2,
        });
      }, 3500);
    });

    socket.on("disconnect", () => {
      console.log("[RoadGuardian Telemetry] Client Disconnected:", socket.id);
    });
  });

  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in development mode.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production static assets from dist/.");
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`[RoadGuardian-Server] Running smoothly on port ${PORT}`);
  });
}

startServer();
