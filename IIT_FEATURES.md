# IIT MADRAS: 20 BREAKTHROUGH FEATURES

## RoadGuardian AI Innovation Memorandum

---

### 1. AI Golden Hour Optimizer

- **Description:** A predictive deployment model that preemptively stages BLS/ALS ambulances near dynamic "risk-zones" based on time, weather, and historical crash data.
- **Technical Implementation:** PostGIS clustering + Prophet time-series forecasting.
- **Demo Flow:** Show a time-lapse of the map where ambulance staging points shift automatically as rainfall starts.
- **Judge Impact Score:** 9.5/10

### 2. Zero-Click Acoustic Crash Detection

- **Description:** Background edge-ML model that detects the acoustic signature of tire screeches followed by impact.
- **Technical Implementation:** TensorFlow Lite audio classification model running on the user's mobile device, triggering an auto-SOS if the user doesn't cancel within 10 seconds.
- **Demo Flow:** Play a crash sound near the device; watch the UI initiate the 10-second SOS countdown.
- **Judge Impact Score:** 9.8/10

### 3. Hyper-Compressed Offline SOS (SMS Hash)

- **Description:** When 4G/5G drops on rural highways, the app compresses GPS, severity, and victim count into a 160-character base64 SMS string.
- **Technical Implementation:** LZMA compression string sent via `sms://` URI to a Twilio gateway that unpacks it into the FastAPI backend.
- **Demo Flow:** Turn off WiFi/Data. Hit SOS. Show the generated SMS hash: `RG#C|V2|13.04,80.12`.
- **Judge Impact Score:** 10/10 (Highly relevant for Indian highways).

### 4. Smart Bystander Coach (Localised)

- **Description:** Real-time, voice-guided first-aid instructions dynamically translated into the user's regional language based on device settings.
- **Technical Implementation:** Gemini Live API for dynamic translation + Text-to-Speech (TTS) for hands-free CPR timing ("stayin' alive" bpm sync).
- **Demo Flow:** User reports "bleeding". Avatar dictates tourniquet instructions in Tamil/Hindi with a visual pulse.
- **Judge Impact Score:** 9.0/10

### 5. Gemini Vision Structural Triage

- **Description:** Bystanders photograph the crashed vehicle. Gemini Vision estimates passenger G-force trauma based on chassis deformation and cabin intrusion.
- **Technical Implementation:** Gemini 1.5 Pro Vision API prompts with structural engineering heuristics.
- **Demo Flow:** Upload an image of a crushed sedan. System instantly flags "High probability of cervical trauma - Dispatching ALS".
- **Judge Impact Score:** 9.5/10

### 6. Code-Switched Audio Triage (NLP)

- **Description:** Indian reporters mix languages (e.g., "Highway pe accident ho gaya, serious hai!"). The NLP agent parses this into standard medical codes.
- **Technical Implementation:** Whisper ASR fine-tuned for Indic code-switching + Gemini Entity Extraction.
- **Demo Flow:** Speak a Hinglish/Tanglish sentence. Show the JSON payload accurately extracting `severity: critical`, `location: highway`.
- **Judge Impact Score:** 9.2/10

### 7. V2X Green Corridor Pathfinder

- **Description:** Integrates with Smart City infrastructure APIs to calculate routing that favors roads with centralized traffic light preemption.
- **Technical Implementation:** OpenStreetMap (OSM) routing engine with edge-weights modified by active traffic light coordination data.
- **Demo Flow:** Show OSMRoute A bypassing a shorter route because Route B has V2X synchronized green lights.
- **Judge Impact Score:** 8.8/10

### 8. Live Trauma Bed Handshake Protocol

- **Description:** Eliminates hospital rejections by programmatically reserving a Level 1/2 trauma bed via API _before_ the ambulance arrives.
- **Technical Implementation:** FastAPI WebHook handshakes with participating hospital EMR systems.
- **Demo Flow:** UI shows "Negotiating Beds..." -> "Apollo Trauma Bed #4 Locked".
- **Judge Impact Score:** 9.6/10

### 9. Mass Casualty Load Balancer (MCI)

- **Description:** If a bus crashes (e.g., 20+ victims), the AI automatically distributes victims across 3-4 different hospitals to prevent collapsing a single local ER.
- **Technical Implementation:** Graph-based capacity distribution algorithm balancing distance with available ER beds.
- **Demo Flow:** Input 35 victims. Map instantly draws routing lines distributing 10 to Hosp A, 15 to Hosp B, 10 to Hosp C.
- **Judge Impact Score:** 9.9/10

### 10. Automated ICE Liaison

- **Description:** Secures 'In Case of Emergency' contacts. The Family Agent sends automated WhatsApp updates to relatives with the hospital destination.
- **Technical Implementation:** Twilio / WhatsApp Business API triggered on the `DISPATCH_CONFIRMED` event.
- **Demo Flow:** Dispatch confirms. The UI shows a mock WhatsApp notification received by a family member with hospital directions.
- **Judge Impact Score:** 8.5/10

### 11. Drone E-Kit Pre-Deployment

- **Description:** Dispatches a medical drone (carrying AED or tourniquets) from the nearest hub while the physical ambulance navigates traffic.
- **Technical Implementation:** API integration with drone logistics platforms (e.g., Zipline / SkyeAir mock APIs).
- **Demo Flow:** Show dual ETA trackers: Drone (3 mins) vs. Ambulance (12 mins).
- **Judge Impact Score:** 9.2/10

### 12. EV Rescue Schematic Overlay (AR)

- **Description:** Identifies EV models via license plate lookup and provides Fire/Rescue EMS with an augmented schematic showing where high-voltage lines are located before using the Jaws of Life.
- **Technical Implementation:** VAHAN API mock + static schematic database.
- **Demo Flow:** Enter plate "TN 01 EV". Display chassis diagram highlighting orange high-voltage cables.
- **Judge Impact Score:** 9.7/10

### 13. Hyper-Local Blood Bank Pinger

- **Description:** Matches the estimated blood type needed (if the victim is registered or based on severity) and preemptively alerts nearby blood banks to prep universal O-Negative.
- **Technical Implementation:** Geospatial radius query against registered blood bank coordinates.
- **Demo Flow:** Trauma detected. Sidebar shows "Alerting 3 Blood Banks for O-Negative prep".
- **Judge Impact Score:** 8.9/10

### 14. Immutable Legal Ledger

- **Description:** Cryptographically signs the timestamp of the SOS, dispatch, and arrival, creating a tamper-proof ledger for police and insurance claims.
- **Technical Implementation:** SHA-256 hash chaining of incident state transitions in PostgreSQL.
- **Demo Flow:** Click a resolved incident to view its "Chain of Custody" cryptographic receipt.
- **Judge Impact Score:** 8.7/10

### 15. Good Samaritan Digital Incentive

- **Description:** Gamifies first-responder bravery by issuing verified "Good Samaritan" digital certificates via DigiLocker APIs, protecting them from legal harassment.
- **Technical Implementation:** Mock DigiLocker integration + India's Good Samaritan Law compliance flags.
- **Demo Flow:** Post-incident, bystander receives a verifiable PDF certificate on their dashboard.
- **Judge Impact Score:** 9.4/10

### 16. Dashcam Traffic Analyzer

- **Description:** Processes the incoming ambulance's dashcam feed to dynamically adjust hospital ETAs based on visual traffic density (e.g., detecting a sudden blockade).
- **Technical Implementation:** Simulated edge-video frame analysis adjusting base OpenStreetMap routing times.
- **Demo Flow:** ETA jumps from 10m to 14m; alert reads "Visual density high on NH-44".
- **Judge Impact Score:** 9.0/10

### 17. Predictive Black-Spot Heatmap

- **Description:** Not just historical data—a dynamic heatmap that highlights sections of the highway that _become_ black-spots only during specific conditions (e.g., 6 PM + heavy rain).
- **Technical Implementation:** Multi-variate spatial rendering on Mapbox/Leaflet.
- **Demo Flow:** Toggle "Rain" filter on the map; watch a specific curve suddenly highlight in red.
- **Judge Impact Score:** 9.3/10

### 18. Zero-Latency WebSocket Mesh

- **Description:** Ensures the bystander, the driving ambulance, and the receiving ER dashboard share a sub-100ms synchronized state.
- **Technical Implementation:** Redis Pub/Sub backplane with FastAPI WebSockets.
- **Demo Flow:** Open two browser windows (Bystander & ER). Bystander adds a note; ER sees it instantly.
- **Judge Impact Score:** 8.8/10

### 19. Driver Drowsiness Pre-Alert

- **Description:** Integrates with fleet trucking APIs. If a truck's internal DMS (Driver Monitoring System) detects sleep, it alerts the RoadGuardian grid to flag the nearby highway sector.
- **Technical Implementation:** Ingestion webhook from third-party telematics providers.
- **Demo Flow:** Sector glows orange on the map: "High Drowsiness Detected in Fleet Sector".
- **Judge Impact Score:** 9.1/10

### 20. NLP Post-Crash Analytics Storyteller

- **Description:** Instead of just charts, the Analytics Agent generates a human-readable weekly newsletter summarizing grid performance ("We saved 14 minutes on average this week...").
- **Technical Implementation:** Gemini text generation based on PostgreSQL aggregate queries.
- **Demo Flow:** Click "Generate Weekly Briefing" to see a beautifully formatted narrative report.
- **Judge Impact Score:** 8.5/10
