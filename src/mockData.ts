import { Incident, TraumaCenter, AmbulanceUnit, PoliceUnit } from "./types";

export const mockTraumaCenters: TraumaCenter[] = [
  {
    name: "Sri Ramachandra Medical Centre (Level 1)",
    distance: "3.2 km",
    contact: "+91-44-45928500",
    bedsAvailable: 4,
    specialty: "Poly-trauma & Neuro Surgery",
    address: "Porur, Chennai",
  },
  {
    name: "SIMS Hospital (Level 2)",
    distance: "5.8 km",
    contact: "+91-44-23002300",
    bedsAvailable: 1,
    specialty: "Orthopedics & Emergency",
    address: "Vadapalani, Chennai",
  },
  {
    name: "Apollo Greams Road Emergency Unit",
    distance: "8.1 km",
    contact: "+91-44-28293333",
    bedsAvailable: 0,
    specialty: "Critical Care",
    address: "Greams Road, Chennai",
  },
];

export const mockAmbulances: AmbulanceUnit[] = [
  {
    id: "TN-01-AMB-4042",
    operator: "108 EMRI",
    contact: "VHF-CH4",
    status: "available",
    eta: "4 mins",
    type: "ALS (Advanced Life Support)",
  },
  {
    id: "TN-09-AMB-1199",
    operator: "Apollo Fleet",
    contact: "VHF-CH2",
    status: "busy",
    eta: "12 mins",
    type: "BLS (Basic Life Support)",
  },
];

export const mockPolice: PoliceUnit[] = [
  {
    stationName: "Koyambedu Traffic Enforcement",
    contact: "+91-44-24795555",
    division: "Highway Patrol - Zone 4",
    patrolId: "BULL-42",
    eta: "3 mins",
  },
];

export const mockIncidents: Incident[] = [
  {
    id: "INC-8892-A",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    location: {
      lat: 13.0642,
      lng: 80.1982,
      address: "NH-45 bypass, Mount Poonamallee Road intersection",
      city: "Chennai",
    },
    description:
      "Multi-vehicle collision reported by bystander audio hash. Possible severe trauma.",
    severity: "Critical",
    status: "dispatching",
    victimsCount: 3,
    vehicleInfo: "1 Heavy Lorry, 1 Sedan",
    incidentType: "Collision",
    injuryTypes: ["Blunt Force Trauma", "Lacerations"],
    hazmat: false,
    traumaCenter: mockTraumaCenters[0],
    ambulance: mockAmbulances[0],
    policeUnit: mockPolice[0],
    familyContacts: [
      {
        name: "Suresh R.",
        relation: "Brother",
        phone: "+91-9876543210",
        notified: true,
        notificationTime: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      },
    ],
    agentsLog: [
      {
        agentName: "Emergency Coordinator",
        status: "success",
        message: "Incident received via SOS broadcast. Triaging initiated.",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        agentName: "Severity Assessment Analyzer",
        status: "success",
        message:
          "Analyzed raw audio. Extracted: 3 victims, head injury suspected. Classified: Critical.",
        timestamp: new Date(Date.now() - 1000 * 60 * 4.8).toISOString(),
      },
      {
        agentName: "Hospital Discovery Agent",
        status: "success",
        message: "Sri Ramachandra matched. 3.2km away. 4 ICU beds available.",
        timestamp: new Date(Date.now() - 1000 * 60 * 4.5).toISOString(),
      },
      {
        agentName: "Ambulance Dispatch Agent",
        status: "success",
        message: "Assigned TN-01-AMB-4042 (ALS). ETA 4 mins.",
        timestamp: new Date(Date.now() - 1000 * 60 * 4.1).toISOString(),
      },
      {
        agentName: "Police Liaison Agent",
        status: "success",
        message: "Koyambedu Traffic notified for NH-45 lane clearance.",
        timestamp: new Date(Date.now() - 1000 * 60 * 3.9).toISOString(),
      },
      {
        agentName: "Family Notification Agent",
        status: "working",
        message: "ICE contact 'Suresh R.' SMS dispatched with hospital route.",
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      },
    ],
  },
  {
    id: "INC-8893-B",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    location: {
      lat: 12.8315,
      lng: 80.0469,
      address: "Outer Ring Road, near Vandalur zoo",
      city: "Chennai",
    },
    description: "Single two-wheeler skid. Rider hit divider. Helmet intact.",
    severity: "Moderate",
    status: "en-route",
    victimsCount: 1,
    vehicleInfo: "Two Wheeler (Motorcycle)",
    incidentType: "Skid",
    injuryTypes: ["Abrasions", "Concussion"],
    hazmat: false,
    traumaCenter: mockTraumaCenters[1],
    ambulance: mockAmbulances[1],
    agentsLog: [
      {
        agentName: "Emergency Coordinator",
        status: "success",
        message: "Applet distress signal received. 1 victim.",
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      },
      {
        agentName: "Severity Assessment Analyzer",
        status: "success",
        message: "No massive trauma indicated. Classified as Moderate.",
        timestamp: new Date(Date.now() - 1000 * 60 * 24.8).toISOString(),
      },
    ],
  },
];

export const OFFLINE_FIRST_AID_TOPICS = [
  {
    id: "cpr",
    title: "CPR (Cardiopulmonary Resuscitation)",
    description: "When breathing or heartbeat has stopped.",
    icon: "HeartPulse",
    steps: [
      "Check if the Highway is safe.",
      "Check for responsiveness to gentle taps and shouts.",
      "Call emergency services immediately.",
      "Start chest compressions at 100-120 beats per minute.",
      "Allow the chest to recoil fully between compressions.",
    ],
  },
  {
    id: "bleeding",
    title: "Severe Bleeding Control",
    description: "Protocol to stop massive external hemorrhage.",
    icon: "Droplets",
    steps: [
      "Find the source of the bleeding.",
      "Apply firm, direct pressure with a clean cloth or gauze.",
      "If it bleeds through, add more cloth on top; do not remove the first layer.",
      "Keep pressure constant for at least 5-10 minutes.",
      "Keep the injured limb elevated if possible.",
    ],
  },
  {
    id: "fracture",
    title: "Spinal / Bone Fracture Protocol",
    description: "Handling suspected broken bones or spinal cord damage.",
    icon: "Bone",
    steps: [
      "Do not move the victim unless absolutely necessary for safety.",
      "Support the head and neck in the position found.",
      "Apply a makeshift splint only if transport is necessary.",
      "Do not attempt to realign the bone.",
    ],
  },
];
export const INITIAL_INCIDENTS = mockIncidents;

export const INITIAL_BLACK_SPOTS = [
  {
    id: "bs-01",
    highway: "NH-45",
    coordinates: { lat: 12.83, lng: 80.05 },
    dangerLevel: "High",
    recentAccidents: 12,
    primaryRiskFactor: "Sharp Curve & Poor Illumination",
    recommendedMeasure: "Install high-lumen LED arrays & rumble strips",
    weatherRisk: "High in Rain",
  },
  {
    id: "bs-02",
    highway: "SH-49",
    coordinates: { lat: 12.55, lng: 80.12 },
    dangerLevel: "Medium",
    recentAccidents: 5,
    primaryRiskFactor: "Unexpected Pedestrian Crossing",
    recommendedMeasure: "Construct pedestrian overpass",
    weatherRisk: "Moderate",
  },
];
