# RoadGuardian AI: Regulatory and Product Requirements Document (PRD)

This folder documents the high-level and granular Product Requirements, conforming with MoRTH (Ministry of Road Transport and Highways) sandboxed specifications and standard Golden Hour emergency timelines.

---

## 1. Product Requirements Overview

The application satisfies the following core emergency product mandates:

| Requirement ID | Module / Component  | Specification Name                      | Goal / Metric                                                                                | Status     |
| :------------- | :------------------ | :-------------------------------------- | :------------------------------------------------------------------------------------------- | :--------- |
| **REQ-001**    | SOS Trigger         | Caller-Duress Tolerant Multi-input      | Allow bystanders to submit video, voice transcribing, or text-inputs.                        | **Active** |
| **REQ-002**    | Severity Assessment | Real-time Trauma Injury Categorization  | Return a structured severity level (Minor, Moderate, Severe, Critical) under 750ms.          | **Active** |
| **REQ-003**    | Hospital Finder     | Spatial Trauma Geo-Radius Search        | Prioritize Level 1 over Level 3 trauma centers depending on severe score.                    | **Active** |
| **REQ-004**    | Ambulance Finder    | ALS/BLS Automated CAD Allocation        | Ensure proper equipment matches the injury (e.g. cervical spine immobilization).             | **Active** |
| **REQ-005**    | Offline Resilience  | Zero-connectivity SMS Fallback Protocol | Packaging coordinates and distress vectors into 160-char raw string text formats (`RG_SOS`). | **Active** |

---

## 2. Competitive Edge & Revenue Assessment

1. **Zero Onboarding Friction:** Bystanders are not required to complete standard verification registration to send alarms. Simple geolocation detection happens immediately on viewport load.
2. **MoRTH Status Synchronization:** Integrates sandboxed national APIs and aligns police dispatch polygons with active highway patrol lanes.
3. **Intellectual Technology:** Pre-emptive trauma evaluations lower triage errors on emergency entry, lowering hospital overloads.

---

## 3. Sandboxed Regulatory Compliance

- **GDPR & PDPB (Data Protection):** Incident logs do not store personally identifiable patient information permanently.
- **MoRTH Standard Alignment:** Road classification matches current National Highway blueprints.
