# RoadGuardian AI documentation

Welcome to the RoadGuardian AI Project Guides! This directory contains documentation about key system modules, workflows, and operations.

---

## 1. System Navigation Guide

The platform consists of several core dashboards tailored to different emergency responder roles and analytical needs:

1. **Consumer SOS Panel:** The caller-duress safe interface for real-time reporting. Bystanders can describe incidents via voice transcriptions, upload crash images, or fetch instant offline first-aid guides.
2. **Emergency Dispatch Console:** The operation center for dispatchers. Displays active live accident logs, live ambulance tracking on a spatial Tamil Nadu Leaflet map, and direct dispatch directives.
3. **Multi-Agent Console:** The technical showcase of the orchestrator state machine. Highlights the consensus of the **5 core high-frequency intelligence agents** in real-time, detailing active inputs, state variables, reasoning logs, and tools used.
4. **Predictive Analytics Hub:** Evaluates seasonal risk maps, identifies highway accident black spots (using PostGIS clustering), and reviews system efficiency metrics ( Golden Hour performance analysis).
5. **Offline Emergency Kit:** Pre-baked local first-aid animations and our proprietary 160-character high-compression SOS SMS packager.

---

## 2. Emergency Operational Workflows

```text
 Bystander   ──►   Reporter Triggers   ──►   Coordinator Agent      ──►  Concurrently Triggers:
 Accident            voice, text, or         - Validates Inputs           - Severity Agent
 Reported            photos                  - Starts Consensus           - Hospital Finder Agent
                                                                          - Ambulance Dispatcher Agent
                                                                          - Highway Police Agent
```

1. **Incident Trigger:** Unstructured data is submitted to the platform.
2. **Severity Analysis:** Clinician Agent processes the trauma signs, flags consciousness indicators, and determines injury levels.
3. **Concurrent Allocation:**
   - **Hospital Agent:** Secures Level 1 bed allocations.
   - **Ambulance Agent:** Selects the nearest ALS/BLS unit.
   - **Police Agent:** Dispatches Highway Patrol vehicles to route traffic.
4. **First-Aid Guidance:** Real-time localized translations walk bystanders through safe aid maneuvers (Cervical stabilization, direct pressure, etc.) while responders are en route.
