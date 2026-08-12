/**
 * India Emergency Intelligence Dataset Generator
 *
 * Generates 34,000 realistic synthetic records across India:
 * - Hospitals (10,000)
 * - Police Stations (6,000)
 * - Rescue Services (3,000)
 * - Ambulance Providers (15,000)
 *
 * Run with: node scripts/generate_india_dataset.js
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

// Major locations across all Indian States & UTs with approximate coordinates
const LOCATIONS = [
  // Andhra Pradesh
  {
    state: "Andhra Pradesh",
    district: "Visakhapatnam",
    city: "Visakhapatnam",
    lat: 17.6868,
    lng: 83.2185,
  },
  {
    state: "Andhra Pradesh",
    district: "Vijayawada",
    city: "Vijayawada",
    lat: 16.5062,
    lng: 80.648,
  },
  // Arunachal Pradesh
  {
    state: "Arunachal Pradesh",
    district: "Papum Pare",
    city: "Itanagar",
    lat: 27.0844,
    lng: 93.6053,
  },
  // Assam
  {
    state: "Assam",
    district: "Kamrup Metropolitan",
    city: "Guwahati",
    lat: 26.1445,
    lng: 91.7362,
  },
  // Bihar
  {
    state: "Bihar",
    district: "Patna",
    city: "Patna",
    lat: 25.5941,
    lng: 85.1376,
  },
  // Chhattisgarh
  {
    state: "Chhattisgarh",
    district: "Raipur",
    city: "Raipur",
    lat: 21.2514,
    lng: 81.6296,
  },
  // Goa
  {
    state: "Goa",
    district: "North Goa",
    city: "Panaji",
    lat: 15.4909,
    lng: 73.8278,
  },
  // Gujarat
  {
    state: "Gujarat",
    district: "Ahmedabad",
    city: "Ahmedabad",
    lat: 23.0225,
    lng: 72.5714,
  },
  {
    state: "Gujarat",
    district: "Surat",
    city: "Surat",
    lat: 21.1702,
    lng: 72.8311,
  },
  // Haryana
  {
    state: "Haryana",
    district: "Gurugram",
    city: "Gurugram",
    lat: 28.4595,
    lng: 77.0266,
  },
  // Himachal Pradesh
  {
    state: "Himachal Pradesh",
    district: "Shimla",
    city: "Shimla",
    lat: 31.1048,
    lng: 77.1734,
  },
  // Jharkhand
  {
    state: "Jharkhand",
    district: "Ranchi",
    city: "Ranchi",
    lat: 23.3441,
    lng: 85.3096,
  },
  // Karnataka
  {
    state: "Karnataka",
    district: "Bengaluru Urban",
    city: "Bengaluru",
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    state: "Karnataka",
    district: "Mysuru",
    city: "Mysuru",
    lat: 12.2958,
    lng: 76.6394,
  },
  // Kerala
  {
    state: "Kerala",
    district: "Thiruvananthapuram",
    city: "Thiruvananthapuram",
    lat: 8.5241,
    lng: 76.9366,
  },
  {
    state: "Kerala",
    district: "Ernakulam",
    city: "Kochi",
    lat: 9.9312,
    lng: 76.2673,
  },
  // Madhya Pradesh
  {
    state: "Madhya Pradesh",
    district: "Bhopal",
    city: "Bhopal",
    lat: 23.2599,
    lng: 77.4126,
  },
  {
    state: "Madhya Pradesh",
    district: "Indore",
    city: "Indore",
    lat: 22.7196,
    lng: 75.8577,
  },
  // Maharashtra
  {
    state: "Maharashtra",
    district: "Mumbai District",
    city: "Mumbai",
    lat: 19.076,
    lng: 72.8777,
  },
  {
    state: "Maharashtra",
    district: "Pune",
    city: "Pune",
    lat: 18.5204,
    lng: 73.8567,
  },
  // Manipur
  {
    state: "Manipur",
    district: "Imphal West",
    city: "Imphal",
    lat: 24.817,
    lng: 93.9368,
  },
  // Meghalaya
  {
    state: "Meghalaya",
    district: "East Khasi Hills",
    city: "Shillong",
    lat: 25.5788,
    lng: 91.8933,
  },
  // Mizoram
  {
    state: "Mizoram",
    district: "Aizawl",
    city: "Aizawl",
    lat: 23.7271,
    lng: 92.7176,
  },
  // Nagaland
  {
    state: "Nagaland",
    district: "Kohima",
    city: "Kohima",
    lat: 25.6751,
    lng: 94.1086,
  },
  // Odisha
  {
    state: "Odisha",
    district: "Khordha",
    city: "Bhubaneswar",
    lat: 20.2961,
    lng: 85.8245,
  },
  // Punjab
  {
    state: "Punjab",
    district: "Ludhiana",
    city: "Ludhiana",
    lat: 30.901,
    lng: 75.8573,
  },
  {
    state: "Punjab",
    district: "Amritsar",
    city: "Amritsar",
    lat: 31.634,
    lng: 74.8723,
  },
  // Rajasthan
  {
    state: "Rajasthan",
    district: "Jaipur",
    city: "Jaipur",
    lat: 26.9124,
    lng: 75.7873,
  },
  {
    state: "Rajasthan",
    district: "Jodhpur",
    city: "Jodhpur",
    lat: 26.2389,
    lng: 73.0243,
  },
  // Sikkim
  {
    state: "Sikkim",
    district: "East Sikkim",
    city: "Gangtok",
    lat: 27.3389,
    lng: 88.6065,
  },
  // Tamil Nadu
  {
    state: "Tamil Nadu",
    district: "Chennai",
    city: "Chennai",
    lat: 13.0827,
    lng: 80.2707,
  },
  {
    state: "Tamil Nadu",
    district: "Coimbatore",
    city: "Coimbatore",
    lat: 11.0168,
    lng: 76.9558,
  },
  {
    state: "Tamil Nadu",
    district: "Madurai",
    city: "Madurai",
    lat: 9.9252,
    lng: 78.1198,
  },
  // Telangana
  {
    state: "Telangana",
    district: "Hyderabad",
    city: "Hyderabad",
    lat: 17.385,
    lng: 78.4867,
  },
  // Tripura
  {
    state: "Tripura",
    district: "West Tripura",
    city: "Agartala",
    lat: 23.8315,
    lng: 91.2868,
  },
  // Uttar Pradesh
  {
    state: "Uttar Pradesh",
    district: "Lucknow",
    city: "Lucknow",
    lat: 26.8467,
    lng: 80.9462,
  },
  {
    state: "Uttar Pradesh",
    district: "Kanpur Nagar",
    city: "Kanpur",
    lat: 26.4499,
    lng: 80.3319,
  },
  // Uttarakhand
  {
    state: "Uttarakhand",
    district: "Dehradun",
    city: "Dehradun",
    lat: 30.3165,
    lng: 78.0322,
  },
  // West Bengal
  {
    state: "West Bengal",
    district: "Kolkata",
    city: "Kolkata",
    lat: 22.5726,
    lng: 88.3639,
  },
  // Delhi
  {
    state: "Delhi",
    district: "New Delhi",
    city: "New Delhi",
    lat: 28.6139,
    lng: 77.209,
  },
  // Jammu & Kashmir
  {
    state: "Jammu and Kashmir",
    district: "Srinagar",
    city: "Srinagar",
    lat: 34.0837,
    lng: 74.7973,
  },
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
  "Max",
  "AIIMS",
  "Manipal",
];
const HOSPITAL_SUFFIXES = [
  "Hospital",
  "Multi-Specialty Center",
  "Trauma Care",
  "Medical College",
  "General Hospital",
  "Healthcare",
  "Clinic",
];
const AVAILABILITY = ["Available", "Busy", "Full"];

// Utility to generate random coordinates within ~50km radius of a base location for varied spread
function getRandomCoordinates(baseLat, baseLng, radiusKm = 50) {
  const r = radiusKm / 111.3;
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
    const coords = getRandomCoordinates(loc.lat, loc.lng, Math.random() * 100); // Up to 100km spread
    const isGov = Math.random() > 0.7;
    const prefix = isGov
      ? "Government"
      : getRandomItem(HOSPITAL_PREFIXES.filter((p) => p !== "Government"));
    const suffix = getRandomItem(HOSPITAL_SUFFIXES);

    records.push({
      id: `HSP-${i + 1}`,
      name: `${prefix} ${suffix} ${loc.city}`,
      state: loc.state,
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
    const coords = getRandomCoordinates(loc.lat, loc.lng, Math.random() * 80);
    const stationCode =
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      Math.floor(Math.random() * 100 + 1);

    records.push({
      id: `POL-${i + 1}`,
      name: `${loc.city} Police Station - ${stationCode}`,
      state: loc.state,
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
    const coords = getRandomCoordinates(loc.lat, loc.lng, Math.random() * 80);
    const isFire = Math.random() > 0.4;

    records.push({
      id: `RES-${i + 1}`,
      name: isFire
        ? `${loc.state} Fire & Rescue - ${loc.city} Zone`
        : `SDRF - ${loc.district} Unit`,
      state: loc.state,
      district: loc.district,
      city: loc.city,
      latitude: coords.lat,
      longitude: coords.lng,
      phone: generatePhone(),
      service_type: "Rescue",
      availability_status: getRandomItem(["Available", "Available", "Busy"]),
    });
  }
  return records;
}

function generateAmbulances(count) {
  const records = [];
  for (let i = 0; i < count; i++) {
    const loc = getRandomItem(LOCATIONS);
    const coords = getRandomCoordinates(loc.lat, loc.lng, Math.random() * 120); // Mobile, broader spread
    const type = Math.random() > 0.4 ? "108 ALS" : "Private BLS";

    records.push({
      id: `AMB-${i + 1}`,
      name: `${type} Ambulance - ${loc.city}`,
      state: loc.state,
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
console.log("Generating RoadGuardian AI All-India Synthetic Dataset...");
const allData = [
  ...generateHospitals(10000), // 10,000 Hospitals
  ...generatePoliceStations(6000), // 6,000 Police Stations
  ...generateRescueServices(3000), // 3,000 Rescue Services
  ...generateAmbulances(15000), // 15,000 Ambulances
];

// Write JSON
const jsonPath = path.join(OUTPUT_DIR, "india_emergency_dataset.json");
fs.writeFileSync(jsonPath, JSON.stringify(allData, null, 2));
console.log(`Generated JSON: ${jsonPath}`);

// Write CSV
const csvHeaders = [
  "id",
  "name",
  "state",
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
    `"${row.id}","${row.name}","${row.state}","${row.district}","${row.city}",${row.latitude},${row.longitude},"${row.phone}","${row.service_type}","${row.availability_status}"`,
);
const csvPath = path.join(OUTPUT_DIR, "india_emergency_dataset.csv");
fs.writeFileSync(csvPath, [csvHeaders, ...csvRows].join("\n"));
console.log(`Generated CSV: ${csvPath}`);

// Write SQL
const sqlPath = path.join(OUTPUT_DIR, "seed_india_resources.sql");
let sqlContent = `-- RoadGuardian AI PostgreSQL Seed Script (All India)
-- Generates PostGIS Point geometries
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS emergency_resources (
    id VARCHAR(50) PRIMARY KEY,
    name text NOT NULL,
    state text NOT NULL,
    district text NOT NULL,
    city text NOT NULL,
    phone text,
    service_type text NOT NULL,
    availability_status text NOT NULL,
    location geometry(Point, 4326) NOT NULL
);

TRUNCATE TABLE emergency_resources;
\n`;

// Batch INSERT to keep file readable and insertions fast
const BATCH_SIZE = 1000;
for (let i = 0; i < allData.length; i += BATCH_SIZE) {
  const batch = allData.slice(i, i + BATCH_SIZE);
  const values = batch
    .map(
      (r) =>
        `('${r.id}', '${r.name.replace(/'/g, "''")}', '${r.state}', '${r.district}', '${r.city}', '${r.phone}', '${r.service_type}', '${r.availability_status}', ST_SetSRID(ST_MakePoint(${r.longitude}, ${r.latitude}), 4326))`,
    )
    .join(",\n    ");

  sqlContent += `INSERT INTO emergency_resources (id, name, state, district, city, phone, service_type, availability_status, location) VALUES\n    ${values};\n\n`;
}

fs.writeFileSync(sqlPath, sqlContent);
console.log(`Generated SQL Seed: ${sqlPath}`);
console.log("✅ Generation Complete. 34,000 Total Records created.");
