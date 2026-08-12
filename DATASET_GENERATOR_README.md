# Tamil Nadu Emergency Intelligence Dataset Generator

A production-grade synthetic data pipeline for generating localized Tamil Nadu Emergency Intelligence resources. Designed specifically for hackathon use to supply 5000+ realistic rows of test data for mapping, dashboards, and AI routing.

## 🚀 How to Run the Generator

A Node.js script has been created within the project. Run the following command from the project root:

```bash
npm run generate-dataset
```

_(This triggers the `generate_dataset.js` script inside the `/scripts` directory)._

## 📊 Dataset Specifications

The generator successfully creates a highly randomized, geographically constrained dataset comprising approx 5000 records:

- **Hospitals:** 2,000 locations
- **Police Stations:** 1,000 locations
- **Rescue Services (SDRF/Fire):** 1,000 locations
- **Ambulances (108 ALS / Private BLS):** 1,000 locations

### Data Fields

- `id`
- `name`
- `district`
- `city`
- `latitude` (Constrained around 18 major TN cities)
- `longitude`
- `phone`
- `service_type`
- `availability_status`

## 📦 Generated Artefacts

Once run, you will find a new `/dataset_output` directory containing:

1. **`tn_emergency_dataset.json`** - JSON payloads for frontend initialization (Leaflet maps, React UI lists).
2. **`tn_emergency_dataset.csv`** - Formatted CSV file intended for data science pipelines or analytics ingestion.
3. **`seed_tn_resources.sql`** - A production-grade PostgreSQL seed script. It automatically uses PostGIS geometry formats (`ST_SetSRID(ST_MakePoint...)`) to ingest the geographic variables cleanly into a PostGIS `GIST` indexed database.

This guarantees you have a scale-tested, realistic backend for mapping endpoints during hackathon demonstrations.
