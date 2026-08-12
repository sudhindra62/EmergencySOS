/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SeverityLevel = "Minor" | "Moderate" | "Severe" | "Critical";
export type IncidentStatus =
  | "reported"
  | "dispatching"
  | "en-route"
  | "on-scene"
  | "resolved";

export interface LocationCoordinates {
  lat: number;
  lng: number;
  latitude?: number; // support maps-grounding structures if needed
  longitude?: number;
}

export interface LocationDetail {
  lat: number;
  lng: number;
  address: string;
  highway?: string;
  city?: string;
  state?: string;
}

export interface TraumaCenter {
  name: string;
  distance: string;
  contact: string;
  bedsAvailable: number;
  specialty: string;
  address: string;
}

export interface AmbulanceUnit {
  id: string;
  operator: string;
  contact: string;
  status: "available" | "dispatched" | "busy";
  eta: string;
  type: string;
}

export interface PoliceUnit {
  stationName: string;
  contact: string;
  division: string;
  patrolId: string;
  eta: string;
}

export interface AgentEvent {
  agentName: string;
  status: "working" | "success" | "warning" | "info";
  message: string;
  timestamp: string;
}

export interface EmergencyContacts {
  name: string;
  relation: string;
  phone: string;
  notified: boolean;
  notificationTime?: string;
}

export interface Incident {
  id: string;
  timestamp: string;
  location: LocationDetail;
  description: string;
  severity: SeverityLevel;
  status: IncidentStatus;
  victimsCount: number;
  victimCount?: number;
  vehicleInfo: string;
  incidentType?: string;
  confidence?: number | string;
  firstAidProtocol?: string;
  nearestHospital?: string;
  nearestPoliceUnit?: string;
  ambulanceETA?: string;
  riskLevel?: string;
  injuryTypes: string[];
  hazmat?: boolean;
  traumaCenter?: TraumaCenter;
  ambulance?: AmbulanceUnit;
  policeUnit?: PoliceUnit;
  familyContacts?: EmergencyContacts[];
  agentsLog?: AgentEvent[];
  recommendedActions?: string[];
  audioResponseText?: string;
}

export interface BlackSpot {
  id: string;
  highway: string;
  coordinates: LocationCoordinates;
  dangerLevel: "High" | "Medium" | "Low";
  recentAccidents: number;
  primaryRiskFactor: string;
  recommendedMeasure: string;
  weatherRisk?: string;
}

export interface OfflineFirstAidTopic {
  id: string;
  title: string;
  description: string;
  steps: string[];
  icon: string;
}
