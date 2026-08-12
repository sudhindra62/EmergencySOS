/**
 * Tamil Nadu Emergency Intelligence Dataset Generator
 *
 * Generates 5000+ realistic synthetic records for:
 * - Hospitals (2000)
 * - Police Stations (1000)
 * - Rescue Services (1000)
 * - Ambulance Providers (1000)
 *
 * Run with: node scripts/generate_dataset.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, "../dataset_output");

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// TN Districts & Major Cities with Approximate Coordinates (Lat, Lng)
const LOCATIONS = [
  { district: "Chennai", city: "Chennai", lat: 13.0827, lng: 80.2707 },
  { district: "Coimbatore", city: "Coimbatore", lat: 11.0168, lng: 76.9558 },
  { district: "Madurai", city: "Madurai", lat: 9.9252, lng: 78.1198 },
  { district: "Tiruchirappalli", city: "Trichy", lat: 10.7905, lng: 78.7047 },
  { district: "Salem", city: "Salem", lat: 11.6643, lng: 78.146 },
  { district: "Tirunelveli", city: "Tirunelveli", lat: 8.7139, lng: 77.7567 },
  { district: "Tiruppur", city: "Tiruppur", lat: 11.1085, lng: 77.3411 },
  { district: "Vellore", city: "Vellore", lat: 12.9165, lng: 79.1325 },
  { district: "Erode", city: "Erode", lat: 11.341, lng: 77.7172 },
  { district: "Thoothukudi", city: "Thoothukudi", lat: 8.7642, lng: 78.1348 },
  { district: "Dindigul", city: "Dindigul", lat: 10.3673, lng: 77.9803 },
  { district: "Thanjavur", city: "Thanjavur", lat: 10.787, lng: 79.1378 },
  { district: "Ranipet", city: "Ranipet", lat: 12.9274, lng: 79.333 },
  { district: "Kanchipuram", city: "Kanchipuram", lat: 12.8342, lng: 79.7036 },
  { district: "Cuddalore", city: "Cuddalore", lat: 11.748, lng: 79.7714 },
  { district: "Kanyakumari", city: "Nagercoil", lat: 8.1833, lng: 77.4119 },
  { district: "Dharmapuri", city: "Dharmapuri", lat: 12.1211, lng: 78.1582 },
  { district: "Krishnagiri", city: "Hosur", lat: 12.7409, lng: 77.8253 },
];

const HOSPITAL_PREFIXES = [
  "Sri",
  "Apollo",
  "Global",
  "Kaveri",
  "Meenakshi",
  "Government",
  "City",
  "Vital",
  "Care",
  "Fortis",
];
const HOSPITAL_SUFFIXES = [
  "Hospital",
  "Multi-Specialty Center",
  "Trauma Care",
  "Medical College & Hospital",
  "General Hospital",
  "Healthcare",
];
const AVAILABILITY = ["Available", "Busy", "Full"];

// Utility to generate random coordinates within ~15km radius of a base location
function getRandomCoordinates(baseLat, baseLng, radiusKm = 15) {
  const r = radiusKm / 111.3; // roughly 111.3 km per degree
  const u = Math.random();
  const v = Math.random();
  const w = r * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  const newLat = baseLat + y;
  const newLng = baseLng + x / Math.cos(baseLat * (Math.PI / 180));
  return { lat: newLat.toFixed(6), lng: newLng.toFixed(6) };
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePhone() {
  return "+91-" + (Math.floor(Math.random() * 4000000000) + 6000000000);
}

// Data Generators
function generateHospitals(count) {
  const records = [];
  for (let i = 0; i < count; i++) {
    const loc = getRandomItem(LOCATIONS);
    const coords = getRandomCoordinates(loc.lat, loc.lng);
    const isGov = Math.random() > 0.7;
    const prefix = isGov
      ? "Government"
      : getRandomItem(HOSPITAL_PREFIXES.filter((p) => p !== "Government"));
    const suffix = getRandomItem(HOSPITAL_SUFFIXES);

    records.push({
      id: `HSP-${i + 1}`,
      name: `${prefix} ${suffix} ${loc.city}`,
      district: loc.district,
      city: loc.city,
      latitude: coords.lat,
      longitude: coords.lng,
      phone: generatePhone(),
      service_type: "Hospital",
      availability_status: getRandomItem(AVAILABILITY),
    });
  }
  return records;
}

function generatePoliceStations(count) {
  const records = [];
  for (let i = 0; i < count; i++) {
    const loc = getRandomItem(LOCATIONS);
    const coords = getRandomCoordinates(loc.lat, loc.lng);
    const stationCode =
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      Math.floor(Math.random() * 10 + 1);

    records.push({
      id: `POL-${i + 1}`,
      name: `${loc.city} Police Station - ${stationCode}`,
      district: loc.district,
      city: loc.city,
      latitude: coords.lat,
      longitude: coords.lng,
      phone: generatePhone(),
      service_type: "Police",
      availability_status: "Available",
    });
  }
  return records;
}

function generateRescueServices(count) {
  const records = [];
  for (let i = 0; i < count; i++) {
    const loc = getRandomItem(LOCATIONS);
    const coords = getRandomCoordinates(loc.lat, loc.lng);
    const isFire = Math.random() > 0.3;

    records.push({
      id: `RES-${i + 1}`,
      name: isFire
        ? `TN Fire & Rescue - ${loc.city} Zone`
        : `SDRF - ${loc.district} Unit`,
      district: loc.district,
      city: loc.city,
      latitude: coords.lat,
      longitude: coords.lng,
      phone: generatePhone(),
      service_type: "Rescue",
      availability_status: getRandomItem(["Available", "Available", "Busy"]), // Mostly available
    });
  }
  return records;
}

function generateAmbulances(count) {
  const records = [];
  for (let i = 0; i < count; i++) {
    const loc = getRandomItem(LOCATIONS);
    const coords = getRandomCoordinates(loc.lat, loc.lng);
    const type = Math.random() > 0.4 ? "108 ALS" : "Private BLS";

    records.push({
      id: `AMB-${i + 1}`,
      name: `${type} Ambulance - ${loc.city}`,
      district: loc.district,
      city: loc.city,
      latitude: coords.lat,
      longitude: coords.lng,
      phone: generatePhone(),
      service_type: "Ambulance",
      availability_status: getRandomItem(["Available", "Busy", "En-Route"]),
    });
  }
  return records;
}

// Generate Data
console.log("Generating RoadGuardian AI Synthetic Dataset...");
const allData = [
  ...generateHospitals(2000),
  ...generatePoliceStations(1000),
  ...generateRescueServices(1000),
  ...generateAmbulances(1000),
];

// Write JSON
const jsonPath = path.join(OUTPUT_DIR, "tn_emergency_dataset.json");
fs.writeFileSync(jsonPath, JSON.stringify(allData, null, 2));
console.log(`Generated JSON: ${jsonPath}`);

// Write CSV
const csvHeaders = [
  "id",
  "name",
  "district",
  "city",
  "latitude",
  "longitude",
  "phone",
  "service_type",
  "availability_status",
].join(",");
const csvRows = allData.map(
  (row) =>
    `"${row.id}","${row.name}","${row.district}","${row.city}",${row.latitude},${row.longitude},"${row.phone}","${row.service_type}","${row.availability_status}"`,
);
const csvPath = path.join(OUTPUT_DIR, "tn_emergency_dataset.csv");
fs.writeFileSync(csvPath, [csvHeaders, ...csvRows].join("\\n"));
console.log(`Generated CSV: ${csvPath}`);

// Write SQL
const sqlPath = path.join(OUTPUT_DIR, "seed_tn_resources.sql");
let sqlContent = `-- RoadGuardian AI PostgreSQL Seed Script
-- Generates PostGIS Point geometries
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS emergency_resources (
    id VARCHAR(50) PRIMARY KEY,
    name text NOT NULL,
    district text NOT NULL,
    city text NOT NULL,
    phone text,
    service_type text NOT NULL,
    availability_status text NOT NULL,
    location geometry(Point, 4326) NOT NULL
);

TRUNCATE TABLE emergency_resources;
\\n`;

// Batch INSERT to keep file readable
const BATCH_SIZE = 500;
for (let i = 0; i < allData.length; i += BATCH_SIZE) {
  const batch = allData.slice(i, i + BATCH_SIZE);
  const values = batch
    .map(
      (r) =>
        `('${r.id}', '${r.name.replace(/'/g, "''")}', '${r.district}', '${r.city}', '${r.phone}', '${r.service_type}', '${r.availability_status}', ST_SetSRID(ST_MakePoint(${r.longitude}, ${r.latitude}), 4326))`,
    )
    .join(",\\n    ");

  sqlContent += `INSERT INTO emergency_resources (id, name, district, city, phone, service_type, availability_status, location) VALUES\\n    ${values};\\n\\n`;
}

fs.writeFileSync(sqlPath, sqlContent);
console.log(`Generated SQL Seed: ${sqlPath}`);
console.log("✅ Generation Complete. 5,000 Total Records created.");
