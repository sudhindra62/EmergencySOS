import React from "react";
import {
  Database,
  Server,
  Key,
  TableProperties,
  Fingerprint,
  Clock,
  MapPin,
  Zap,
} from "lucide-react";

export default function DBSchemaViewer() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-blue-500/20">
        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <Database className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl text-white font-bold tracking-tight">
            Database Schema Architecture
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            PostgreSQL + PostGIS High-Performance Schema for Agentic Routing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Tables */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center gap-2">
            <TableProperties className="w-4 h-4" /> Core Entities
          </h3>

          <div className="glass-card p-5 border border-white/5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-emerald-400 font-bold text-sm">users</h4>
              <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-slate-400">
                UUID, Indexed
              </span>
            </div>
            <pre className="text-[10px] text-slate-300 font-mono leading-relaxed overflow-x-auto bg-black/40 p-4 rounded-lg">
              {`CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(15) UNIQUE NOT NULL,
  auth_provider VARCHAR(50), -- Firebase Auth ID
  full_name VARCHAR(100),
  blood_group VARCHAR(5),
  medical_history JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`}
            </pre>
            <div className="mt-3 flex gap-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Key className="w-3 h-3 text-amber-400" /> PK: id
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" /> IDX: phone_number
              </span>
            </div>
          </div>

          <div className="glass-card p-5 border border-white/5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-emerald-400 font-bold text-sm">
                incidents (Core State Machine)
              </h4>
              <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-slate-400">
                PostGIS Geometry
              </span>
            </div>
            <pre className="text-[10px] text-slate-300 font-mono leading-relaxed overflow-x-auto bg-black/40 p-4 rounded-lg">
              {`CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES users(id),
  severity VARCHAR(20) CHECK (severity IN ('Minor', 'Moderate', 'Severe', 'Critical')),
  location GEOMETRY(Point, 4326) NOT NULL, -- PostGIS Indexed
  address_text TEXT,
  status VARCHAR(30) DEFAULT 'Reported',
  ai_trauma_score NUMERIC(3,2), -- Calculated by Severity Agent
  multimedia_urls TEXT[], -- Array of GCS paths
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crucial Spatial Index for Fast Radius Searches (< 30ms latency)
CREATE INDEX idx_incidents_location ON incidents USING GIST (location);
CREATE INDEX idx_incidents_status ON incidents(status);`}
            </pre>
          </div>

          <div className="glass-card p-5 border border-white/5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-emerald-400 font-bold text-sm">hospitals</h4>
            </div>
            <pre className="text-[10px] text-slate-300 font-mono leading-relaxed overflow-x-auto bg-black/40 p-4 rounded-lg">
              {`CREATE TABLE hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  trauma_level INTEGER CHECK (trauma_level BETWEEN 1 AND 4),
  location GEOMETRY(Point, 4326) NOT NULL,
  available_icu_beds INTEGER DEFAULT 0,
  available_er_beds INTEGER DEFAULT 0,
  last_ping_status TIMESTAMPTZ
);

CREATE INDEX idx_hospitals_location ON hospitals USING GIST (location);`}
            </pre>
          </div>
        </div>

        {/* Relational & Agent Tables */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Dispatch & Agent Logs
          </h3>

          <div className="glass-card p-5 border border-white/5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-emerald-400 font-bold text-sm">ambulances</h4>
            </div>
            <pre className="text-[10px] text-slate-300 font-mono leading-relaxed overflow-x-auto bg-black/40 p-4 rounded-lg">
              {`CREATE TABLE ambulances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate_number VARCHAR(20) UNIQUE NOT NULL,
  type VARCHAR(10) CHECK (type IN ('ALS', 'BLS')),
  hospital_id UUID REFERENCES hospitals(id),
  current_location GEOMETRY(Point, 4326),
  status VARCHAR(20) CHECK (status IN ('Available', 'Dispatched', 'Busy')),
  last_telemetry TIMESTAMPTZ
);

CREATE INDEX idx_ambulances_location ON ambulances USING GIST (current_location);`}
            </pre>
          </div>

          <div className="glass-card p-5 border border-white/5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-emerald-400 font-bold text-sm">
                dispatch_logs
              </h4>
            </div>
            <pre className="text-[10px] text-slate-300 font-mono leading-relaxed overflow-x-auto bg-black/40 p-4 rounded-lg">
              {`CREATE TABLE dispatch_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id),
  ambulance_id UUID REFERENCES ambulances(id),
  hospital_id UUID REFERENCES hospitals(id),
  dispatched_at TIMESTAMPTZ DEFAULT NOW(),
  arrived_at_scene TIMESTAMPTZ,
  arrived_at_hospital TIMESTAMPTZ,
  route_poly TEXT -- Compressed polyline from OSM agent
);`}
            </pre>
          </div>

          <div className="glass-card p-5 border border-white/5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-purple-400 font-bold text-sm">
                agent_execution_logs
              </h4>
            </div>
            <pre className="text-[10px] text-slate-300 font-mono leading-relaxed overflow-x-auto bg-black/40 p-4 rounded-lg">
              {`CREATE TABLE agent_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id),
  agent_name VARCHAR(50) NOT NULL, -- e.g., 'HospitalAgent', 'RouteAgent'
  input_payload JSONB,
  output_payload JSONB,
  execution_ms INTEGER,
  status VARCHAR(20) CHECK (status IN ('Success', 'Failed', 'Timeout')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Horizontally partitioned by time for massive telemetry intake`}
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-4">
          ER Diagram Overview
        </h3>
        <div className="p-6 glass-card rounded-xl border border-white/5 bg-black/40 flex items-center justify-center min-h-[400px]">
          <pre className="text-[9px] sm:text-[10px] text-cyan-400 font-mono leading-tight whitespace-pre-wrap text-center">
            {`          [users] 1 -- * [incidents]
            |                 |
     1 -- * [ice_contacts]    | 1 -- 1 [dispatch_logs]
                              |               |
                              |               * -- 1 [ambulances]
                              |               |           |
                              * -- * [agent_logs]         | * -- 1 [hospitals]
                              
                              
          [police_stations] (Geo-fenced Jurisdictions)`}
          </pre>
        </div>
      </div>

      <div className="mt-8 p-6 glass-card rounded-xl border border-white/5 bg-black/20">
        <h4 className="text-sm font-bold text-white mb-2">
          Performance & Scale Strategy
        </h4>
        <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
          <li>
            <strong>Geospatial Engine:</strong> Hard dependency on{" "}
            <span className="text-blue-400">PostGIS</span> for all distance
            calculations, `ST_DWithin` queries, and bounding box checks. B-Tree
            indexes are not sufficient; GiST indexing is mandatory.
          </li>
          <li>
            <strong>Telemetry Fast Ingestion:</strong> The
            `ambulances.current_location` is updated via WebSockets. To prevent
            write amplification, high-frequency updates are aggregated in an
            in-memory Redis layer before flushing to PG every 5 seconds.
          </li>
          <li>
            <strong>Connection Pooling:</strong> Managed via PgBouncer in
            transaction mode to handle spikes during mass-casualty events where
            thousands of bystanders might query the status.
          </li>
        </ul>
      </div>
    </div>
  );
}
