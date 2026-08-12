/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Incident,
  SeverityLevel,
  TraumaCenter,
  AmbulanceUnit,
  PoliceUnit,
} from "../types";
import { INDIA_PLACES_REGISTRY } from "./india_places";

// Comprehensive coordinates dictionary for Tamil Nadu places/districts
export interface PlaceCoordinates {
  lat: number;
  lng: number;
  city: string;
  district: string;
  state?: string;
  highway: string;
  address: string;
}

export const TN_PLACES_REGISTRY: Record<string, PlaceCoordinates> = {
  // Key India-wide cities
  delhi: {
    lat: 28.6139,
    lng: 77.209,
    city: "New Delhi",
    district: "New Delhi",
    highway: "NH-44 Corridor",
    address: "India Gate area, New Delhi",
  },
  mumbai: {
    lat: 19.076,
    lng: 72.8777,
    city: "Mumbai",
    district: "Mumbai Suburban",
    highway: "Mumbai-Pune Expressway",
    address: "Bandra Kurla Complex, Mumbai, Maharashtra",
  },
  bengaluru: {
    lat: 12.9716,
    lng: 77.5946,
    city: "Bengaluru",
    district: "Bengaluru Urban",
    highway: "NH-44 Corridor",
    address: "Electronic City Industrial Area, Bengaluru, Karnataka",
  },
  kolkata: {
    lat: 22.5726,
    lng: 88.3639,
    city: "Kolkata",
    district: "Kolkata",
    highway: "NH-16 Corridor",
    address: "Salt Lake Sector V, Kolkata, West Bengal",
  },
  hyderabad: {
    lat: 17.385,
    lng: 78.4867,
    city: "Hyderabad",
    district: "Hyderabad",
    highway: "NH-44 Corridor",
    address: "HITEC City, Hyderabad, Telangana",
  },
  chennai: {
    lat: 13.0827,
    lng: 80.2707,
    city: "Chennai",
    district: "Chennai",
    highway: "NH-45 Grand Southern Trunk Road",
    address: "Poonamallee High Road near Chennai Central, Chennai, Tamil Nadu",
  },
  // Previous TN Places
  mysore: {
    lat: 12.2958,
    lng: 76.6394,
    city: "Mysore",
    district: "Mysore",
    highway: "Urban Sector",
    address: "Vidyaranyapura Industrial Zone, Mysore, Karnataka",
  },
  chengalpattu: {
    lat: 12.6841,
    lng: 79.9836,
    city: "Chengalpattu",
    district: "Chengalpattu",
    highway: "NH-45 Paris-Kanyakumari Hwy",
    address:
      "GST Road Bypass near Paranur Toll Plaza, Chengalpattu, Tamil Nadu",
  },
  kanchipuram: {
    lat: 12.8342,
    lng: 79.7036,
    city: "Kanchipuram",
    district: "Kanchipuram",
    highway: "NH-48 Chennai-Bengaluru Hwy",
    address: "NH-48 Expressway Milestone 41, Kanchipuram Sector, Tamil Nadu",
  },
  coimbatore: {
    lat: 11.0168,
    lng: 76.9558,
    city: "Coimbatore",
    district: "Coimbatore",
    highway: "NH-544 Salem-Cochin Hwy",
    address: "Avinashi Road near Peelamedu, Coimbatore, Tamil Nadu",
  },
  madurai: {
    lat: 9.9252,
    lng: 78.1198,
    city: "Madurai",
    district: "Madurai",
    highway: "NH-38 Tuticorin Hwy",
    address: "Melur Road crossing near High Court Bench, Madurai, Tamil Nadu",
  },
  trichy: {
    lat: 10.7905,
    lng: 78.7047,
    city: "Tiruchirappalli",
    district: "Tiruchirappalli",
    highway: "NH-45 GST Road Sector 4",
    address:
      "Chennai-Trichy Highway Sector milestone 320, Tiruchirappalli, Tamil Nadu",
  },
  tiruchirappalli: {
    lat: 10.7905,
    lng: 78.7047,
    city: "Tiruchirappalli",
    district: "Tiruchirappalli",
    highway: "NH-45 GST Road Sector 4",
    address:
      "Chennai-Trichy Highway Sector milestone 320, Tiruchirappalli, Tamil Nadu",
  },
  salem: {
    lat: 11.6643,
    lng: 78.146,
    city: "Salem",
    district: "Salem",
    highway: "NH-44 Bengaluru Hwy",
    address:
      "Salem Bypass Interchange near Steel Plant Road, Salem, Tamil Nadu",
  },
  tirunelveli: {
    lat: 8.7139,
    lng: 77.7567,
    city: "Tirunelveli",
    district: "Tirunelveli",
    highway: "NH-44 Kanyakumari Hwy",
    address: "Vannarpettai Bypass crossing, Tirunelveli, Tamil Nadu",
  },
  tiruppur: {
    lat: 11.1085,
    lng: 77.3411,
    city: "Tiruppur",
    district: "Tiruppur",
    highway: "SH-37 Dharapuram Hwy",
    address: "Palladam Road near Cotton Market, Tiruppur, Tamil Nadu",
  },
  erode: {
    lat: 11.341,
    lng: 77.7172,
    city: "Erode",
    district: "Erode",
    highway: "SH-15 Sathy Road",
    address: "Perundurai road junction, Erode, Tamil Nadu",
  },
  vellore: {
    lat: 12.9165,
    lng: 79.1325,
    city: "Vellore",
    district: "Vellore",
    highway: "NH-48 Chennai-Bengaluru Hwy",
    address: "Green Circle Flyover intersection, Vellore, Tamil Nadu",
  },
  thoothukudi: {
    lat: 8.7642,
    lng: 78.1348,
    city: "Thoothukudi",
    district: "Thoothukudi",
    highway: "NH-138 Madurai-Tuticorin Hwy",
    address: "Thoothukudi Port access bypass marker, Thoothukudi, Tamil Nadu",
  },
  tuticorin: {
    lat: 8.7642,
    lng: 78.1348,
    city: "Thoothukudi",
    district: "Thoothukudi",
    highway: "NH-138 Madurai-Tuticorin Hwy",
    address: "Thoothukudi Port access bypass marker, Thoothukudi, Tamil Nadu",
  },
  thanjavur: {
    lat: 10.787,
    lng: 79.1378,
    city: "Thanjavur",
    district: "Thanjavur",
    highway: "NH-83 Trichy-Thanjavur Hwy",
    address: "New Bus Stand Bypass road, Thanjavur, Tamil Nadu",
  },
  dharmapuri: {
    lat: 12.1253,
    lng: 78.1578,
    city: "Dharmapuri",
    district: "Dharmapuri",
    highway: "NH-44 Bengaluru Hwy",
    address: "Sogathur bypass junction, Dharmapuri, Tamil Nadu",
  },
  dindigul: {
    lat: 10.3673,
    lng: 77.9803,
    city: "Dindigul",
    district: "Dindigul",
    highway: "NH-83 Bypass Division",
    address: "Dindigul-Vathalagundu exit loop, Dindigul, Tamil Nadu",
  },
  cuddalore: {
    lat: 11.748,
    lng: 79.7714,
    city: "Cuddalore",
    district: "Cuddalore",
    highway: "NH-45A East Coast Hwy",
    address: "Silver Beach road junction near Old Town, Cuddalore, Tamil Nadu",
  },
  nagercoil: {
    lat: 8.1834,
    lng: 77.4119,
    city: "Nagercoil",
    district: "Kanyakumari",
    highway: "NH-66 Trivandrum Road",
    address: "Chettikulam junction expressway corridor, Nagercoil, Tamil Nadu",
  },
  hosur: {
    lat: 12.7409,
    lng: 77.8253,
    city: "Hosur",
    district: "Krishnagiri",
    highway: "NH-48 Border Gateway",
    address: "Attibele Border Checkpost Milestone, Hosur, Tamil Nadu",
  },
  ooty: {
    lat: 11.4102,
    lng: 76.695,
    city: "Ooty",
    district: "Nilgiris",
    highway: "NH-181 Mountain Corridor",
    address: "Charing Cross Junction sector road, Ooty, Tamil Nadu",
  },
  kanyakumari: {
    lat: 8.0883,
    lng: 77.5385,
    city: "Kanyakumari",
    district: "Kanyakumari",
    highway: "NH-44 Southern Milestone Zero",
    address: "Sunset Point expressway intersection, Kanyakumari, Tamil Nadu",
  },
  ariyalur: {
    lat: 11.1401,
    lng: 79.0786,
    city: "Ariyalur",
    district: "Ariyalur",
    highway: "SH-139 Jayankondam Hwy",
    address: "Sendurai road Cement Logistics corridor, Ariyalur, Tamil Nadu",
  },
  kallakurichi: {
    lat: 11.7377,
    lng: 78.9627,
    city: "Kallakurichi",
    district: "Kallakurichi",
    highway: "NH-79 Salem-Ulundurpet Hwy",
    address: "Kachirapalayan junction, Kallakurichi, Tamil Nadu",
  },
  karur: {
    lat: 10.9601,
    lng: 78.0766,
    city: "Karur",
    district: "Karur",
    highway: "NH-81 Kovai hwy Route",
    address: "Karur Bypass near Amaravathi bridge, Karur, Tamil Nadu",
  },
  krishnagiri: {
    lat: 12.5186,
    lng: 78.2138,
    city: "Krishnagiri",
    district: "Krishnagiri",
    highway: "NH-44 Toll Gate Sector",
    address: "Chennai-Bengaluru Interchange Sector, Krishnagiri, Tamil Nadu",
  },
  mayiladuthurai: {
    lat: 11.1018,
    lng: 79.6522,
    city: "Mayiladuthurai",
    district: "Mayiladuthurai",
    highway: "SH-23 Poompuhar road",
    address: "Kallanai Canal Bridge, Mayiladuthurai, Tamil Nadu",
  },
  nagapattinam: {
    lat: 10.7672,
    lng: 79.8444,
    city: "Nagapattinam",
    district: "Nagapattinam",
    highway: "NH-83 East Coast Link",
    address: "Velankanni Bypass milestone, Nagapattinam, Tamil Nadu",
  },
  namakkal: {
    lat: 11.2189,
    lng: 78.1674,
    city: "Namakkal",
    district: "Namakkal",
    highway: "NH-44 Salem Corridor",
    address: "Namakkal Fort road junction, Namakkal, Tamil Nadu",
  },
  perambalur: {
    lat: 11.2342,
    lng: 78.882,
    city: "Perambalur",
    district: "Perambalur",
    highway: "NH-45 Trichy Expressway",
    address: "Thuraiyur road bypass, Perambalur, Tamil Nadu",
  },
  pudukkottai: {
    lat: 10.3833,
    lng: 78.8222,
    city: "Pudukkottai",
    district: "Pudukkottai",
    highway: "NH-336 Karaikudi Road",
    address: "Alangudi road junction, Pudukkottai, Tamil Nadu",
  },
  ramanathapuram: {
    lat: 9.3639,
    lng: 78.8394,
    city: "Ramanathapuram",
    district: "Ramanathapuram",
    highway: "NH-87 Rameshwaram Hwy",
    address:
      "Rameshwaram Bypass near East Coast Road, Ramanathapuram, Tamil Nadu",
  },
  ranipet: {
    lat: 12.9272,
    lng: 79.3331,
    city: "Ranipet",
    district: "Ranipet",
    highway: "NH-48 Expressway Segment",
    address: "Arcot bypass intersection, Ranipet, Tamil Nadu",
  },
  sivaganga: {
    lat: 9.8475,
    lng: 78.4831,
    city: "Sivaganga",
    district: "Sivaganga",
    highway: "SH-33 Madurai road",
    address: "Sivaganga bypass, Sivaganga, Tamil Nadu",
  },
  tenkasi: {
    lat: 8.9592,
    lng: 77.3115,
    city: "Tenkasi",
    district: "Tenkasi",
    highway: "SH-39 Tirunelveli road",
    address: "Shenkottai Road pass near Courtallam entry, Tenkasi, Tamil Nadu",
  },
  theni: {
    lat: 10.0104,
    lng: 77.4777,
    city: "Theni",
    district: "Theni",
    highway: "NH-85 Kochi-Dhanushkodi Hwy",
    address: "Cumbum Road bypass gateway, Theni, Tamil Nadu",
  },
  tirupathur: {
    lat: 12.4926,
    lng: 78.5678,
    city: "Tirupathur",
    district: "Tirupathur",
    highway: "SH-18 Krishnagiri Hwy",
    address: "Tirupathur flyover loop, Tirupathur, Tamil Nadu",
  },
  tiruvallur: {
    lat: 13.1394,
    lng: 79.9071,
    city: "Tiruvallur",
    district: "Tiruvallur",
    highway: "NH-205 Tirupathi Hwy",
    address: "Tiruttani road crossing, Tiruvallur, Tamil Nadu",
  },
  tiruvannamalai: {
    lat: 12.2253,
    lng: 79.0747,
    city: "Tiruvannamalai",
    district: "Tiruvannamalai",
    highway: "NH-77 Pondicherry Hwy",
    address:
      "Polur road roundabout near Girivalam path, Tiruvannamalai, Tamil Nadu",
  },
  tiruvarur: {
    lat: 10.7661,
    lng: 79.6344,
    city: "Tiruvarur",
    district: "Tiruvarur",
    highway: "SH-23 Nagore Highway",
    address: "Tiruvarur Chariot Main street bypass, Tiruvarur, Tamil Nadu",
  },
  viluppuram: {
    lat: 11.9401,
    lng: 79.4862,
    city: "Viluppuram",
    district: "Viluppuram",
    highway: "NH-45 Trichy Expressway",
    address: "Koliyanur bypass interchange, Viluppuram, Tamil Nadu",
  },
  virudhunagar: {
    lat: 9.568,
    lng: 77.9624,
    city: "Virudhunagar",
    district: "Virudhunagar",
    highway: "NH-44 Madurai-Kanyakumari Hwy",
    address:
      "Virudhunagar Toll Plaza milestone tracker, Virudhunagar, Tamil Nadu",
  },
};

// Popular Highways matching
export const HIGHWAY_MARKERS = [
  {
    match: ["nh-44", "nh44", "north-south"],
    lat: 21.1458,
    lng: 79.0882,
    name: "North-South Corridor (NH-44)",
    address: "NH-44 North-South Highway Corridor, Central Segment, India",
  },
  {
    match: ["nh-48", "nh48", "golden quadrilateral"],
    lat: 18.5204,
    lng: 73.8567,
    name: "Golden Quadrilateral (NH-48)",
    address: "NH-48 Golden Quadrilateral Highway, Western Segment, India",
  },
  {
    match: ["nh-19", "nh19", "golden quadrilateral"],
    lat: 26.4499,
    lng: 80.3319,
    name: "Golden Quadrilateral (NH-19)",
    address: "NH-19 Golden Quadrilateral Highway, Eastern Segment, India",
  },
  {
    match: ["nh-16", "nh16", "east coast"],
    lat: 17.6868,
    lng: 83.2185,
    name: "East Coast Highway (NH-16)",
    address: "NH-16 East Coast Highway, Coastal Segment, India",
  },
];

// Helper to check if a string contains coordinates, and if so parses them
export function parseCoordinates(
  text: string,
): { lat: number; lng: number } | null {
  // Pattern matches things like: "13.0827, 80.2707" or "lat 11.1271, lng 78.6569" or "Coordinates: 12.98, 80.14"
  const coordinateRegex = /(-?\d{1,2}\.\d+)\s*,\s*(-?\d{2,3}\.\d+)/;
  const match = text.match(coordinateRegex);
  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    // Safety boundaries for India coordinate space
    if (lat >= 6.0 && lat <= 36.0 && lng >= 68.0 && lng <= 98.0) {
      return { lat, lng };
    }
  }
  return null;
}

export async function asyncGeocode(text: string): Promise<PlaceCoordinates> {
  const normText = text.toLowerCase();

  // 1. Check direct coordinates
  const directCoords = parseCoordinates(text);
  if (directCoords) {
    return {
      lat: directCoords.lat,
      lng: directCoords.lng,
      city: "Target Location",
      district: "Coordinates",
      highway: "Direct Geolocation",
      address: `[${directCoords.lat.toFixed(4)}, ${directCoords.lng.toFixed(4)}]`,
    };
  }

  // 2. Try Nominatim standard geocoding
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(normText + " India")}&format=json&limit=1`;
    const response = await fetch(url, { headers: { "Accept-Language": "en" } });
    const data = await response.json();
    if (data && data.length > 0) {
      const topResult = data[0];
      return {
        lat: parseFloat(topResult.lat),
        lng: parseFloat(topResult.lon),
        city: topResult.name || "Target Location",
        district: topResult.display_name.split(",")[1]?.trim() || "India",
        highway: topResult.type || "Location",
        address: topResult.display_name,
      };
    }
  } catch (err) {
    console.error("Nominatim fetch error:", err);
  }

  // 3. Fallback to static lists
  return geocodeReportText(text);
}

// Complete geocoding orchestrator
export function geocodeReportText(text: string): PlaceCoordinates {
  const normText = text.toLowerCase();

  // 1. Try to parse coordinates directly from the text
  const directCoords = parseCoordinates(text);
  if (directCoords) {
    // Attempt to identify nearest district back to label names
    let nearestDistrict = "New Delhi";
    let shortestDistance = Infinity;
    Object.keys(INDIA_PLACES_REGISTRY).forEach((key) => {
      const plc = INDIA_PLACES_REGISTRY[key];
      const d = Math.sqrt(
        Math.pow(plc.lat - directCoords.lat, 2) +
          Math.pow(plc.lng - directCoords.lng, 2),
      );
      if (d < shortestDistance) {
        shortestDistance = d;
        nearestDistrict = plc.city;
      }
    });

    return {
      lat: directCoords.lat,
      lng: directCoords.lng,
      city: nearestDistrict,
      district: nearestDistrict + " District",
      highway: "Coordinates Geolocation Entry",
      address: `Tactical Coordinates [${directCoords.lat.toFixed(4)}° N, ${directCoords.lng.toFixed(4)}° E], ${nearestDistrict}, India`,
    };
  }

  // 2. Try highway matches
  for (const hwy of HIGHWAY_MARKERS) {
    for (const token of hwy.match) {
      if (normText.includes(token)) {
        // Find if they also named a city to combine contexts
        let cityScope = "National Hwy Sector";
        let resolvedLat = hwy.lat;
        let resolvedLng = hwy.lng;

        for (const placeKey in INDIA_PLACES_REGISTRY) {
          if (normText.includes(placeKey)) {
            const place = INDIA_PLACES_REGISTRY[placeKey];
            cityScope = place.city;
            // Shift coordinates slightly closer to city segment
            resolvedLat = (hwy.lat + place.lat) / 2;
            resolvedLng = (hwy.lng + place.lng) / 2;
            break;
          }
        }

        return {
          lat: resolvedLat,
          lng: resolvedLng,
          city: cityScope,
          district: cityScope + " District",
          highway: hwy.name,
          address: `Active corridor of ${hwy.name} in ${cityScope} territory, India`,
        };
      }
    }
  }

  // 3. Try keyplaces matching
  for (const placeKey in INDIA_PLACES_REGISTRY) {
    if (normText.includes(placeKey)) {
      return INDIA_PLACES_REGISTRY[placeKey];
    }
  }

  // 4. Fallback search (find token-based word matches)
  const tokens = normText.split(/[\s,]+/);
  for (const t of tokens) {
    if (t.length > 3) {
      for (const placeKey in INDIA_PLACES_REGISTRY) {
        if (placeKey.startsWith(t) || t.startsWith(placeKey)) {
          return INDIA_PLACES_REGISTRY[placeKey];
        }
      }
    }
  }

  // 5. Ultimate Fallback: New Delhi Sector to ensure map is ALWAYS operational
  return INDIA_PLACES_REGISTRY["delhi"];
}

// Generate fully automated resource responses tailored to the parsed area
export function generateAssignedResources(
  lat: number,
  lng: number,
  city: string,
  severity: SeverityLevel,
) {
  // Standard emergency facilities mapping per region
  const hospitalList = [
    {
      name: `AIIMS / Regional Medical Center & Level 1 Trauma Care`,
      address: `Main Expressway, ${city}`,
      contact: "+91 11 2658 8500",
      specialty: "Neuro-Traumatology & Critical Surgery",
    },
    {
      name: `${city} District Headquarters Hospital`,
      address: `Main Road bypass, ${city}`,
      contact: "+91 " + Math.floor(1000000000 + Math.random() * 9000000000),
      specialty: "Emergency Trauma & Surgery",
    },
    {
      name: `Government General Hospital & Trauma Care`,
      address: `NH-Bypass, ${city} Sector`,
      contact: "+91 " + Math.floor(1000000000 + Math.random() * 9000000000),
      specialty: "High Velocity Trauma Care",
    },
    {
      name: `Government General Hospital`,
      address: `Collectorate Road, ${city}`,
      contact: "+91 " + Math.floor(1000000000 + Math.random() * 9000000000),
      specialty: "Advanced Resuscitation Care",
    },
    {
      name: `${city} Apollo/Fortis Specialty Center`,
      address: `Central City Sector, ${city}`,
      contact: "+91 " + Math.floor(1000000000 + Math.random() * 9000000000),
      specialty: "Orthopedic & Spine Emergency",
    },
  ];

  const policeList = [
    {
      stationName: `${city} Highway Traffic Division Patrol Unit`,
      patrolId: `PATROL-${Math.floor(10 + Math.random() * 89)}`,
    },
    {
      stationName: `National Highway Patrolling Patrol-09`,
      patrolId: "PATROL-09",
    },
    {
      stationName: `${city} Central Traffic Police Section`,
      patrolId: `PATROL-${Math.floor(103 + Math.random() * 5)}`,
    },
  ];

  // Pick suitable resources based on geocoded location name
  let hSelected = hospitalList[1]; // default HQ
  if (city.toLowerCase() === "new delhi" || city.toLowerCase() === "mumbai") {
    hSelected = hospitalList[0];
  } else if (city.toLowerCase() === "bengaluru") {
    hSelected = hospitalList[2];
  } else if (
    city.toLowerCase() === "kolkata" ||
    city.toLowerCase() === "hyderabad"
  ) {
    hSelected = hospitalList[3];
  } else if (city.length > 10) {
    hSelected = hospitalList[4];
  }

  // Calculate realistic distance metrics
  const distanceVal = 1.5 + Math.random() * 4.5; // distance between 1.5km and 6km
  const beds = Math.floor(6 + Math.random() * 14);

  const traumaCenter: TraumaCenter = {
    name: hSelected.name,
    distance: `${distanceVal.toFixed(1)} km away`,
    contact: hSelected.contact,
    bedsAvailable: beds,
    specialty: hSelected.specialty,
    address: hSelected.address,
  };

  // Ambulance metrics
  const ambEtaMin = Math.round(3 + distanceVal * 1.5);
  const ambulance: AmbulanceUnit = {
    id: `AMB-108-${Math.floor(10 + Math.random() * 90)}`,
    operator: "GVK EMRI Highway Rescue",
    contact: "108 / Emergency EMS Dispatch",
    status: "dispatched",
    eta: `${ambEtaMin} mins`,
    type: severity === "Critical" || severity === "Severe" ? "ALS" : "BLS",
  };

  // Police metrics
  const policeSelected =
    policeList[Math.floor(Math.random() * policeList.length)];
  const polEtaMin = Math.round(ambEtaMin * 0.9 + 1);
  const policeUnit: PoliceUnit = {
    stationName: policeSelected.stationName,
    contact: `100 / +91 ${Math.floor(40 + Math.random() * 59)} ${Math.floor(1000 + Math.random() * 9000)}-EMERGENCY`,
    division: "Highway Safety Operations, TN Police",
    patrolId: policeSelected.patrolId,
    eta: `${polEtaMin} mins`,
  };

  return { traumaCenter, ambulance, policeUnit };
}
