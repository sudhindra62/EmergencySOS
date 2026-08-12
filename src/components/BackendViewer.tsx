/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Server,
  Code,
  FileJson,
  TerminalSquare,
  Key,
  Cpu,
  Zap,
  FolderTree,
  Database,
} from "lucide-react";

interface BackendSection {
  id: string;
  title: string;
  icon: any;
  content: React.ReactNode;
}

export default function BackendViewer() {
  const [activeTab, setActiveTab] = useState<string>("structure");

  const sections: BackendSection[] = [
    {
      id: "structure",
      title: "Monorepo Structure",
      icon: FolderTree,
      content: (
        <div className="space-y-6">
          <div className="p-8 rounded-[2rem] bg-black/40 border border-white/5 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            <h4 className="text-cyan-400 font-black text-xl mb-6 tracking-widest uppercase flex items-center gap-3 drop-shadow-sm">
              <FolderTree className="w-6 h-6 text-cyan-500 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />{" "}
              FastAPI Module Architecture
            </h4>

            <div className="bg-black/60 p-6 rounded-[1.5rem] border border-cyan-500/20 overflow-x-auto text-[11px] sm:text-xs shadow-inner">
              <pre className="text-blue-100/70 font-mono leading-relaxed font-bold">
                {`backend/
├── app/
│   ├── main.py                 # FastAPI Application Server Entry
│   ├── core/
│   │   ├── config.py           # Highway, Pydantic BaseSettings
│   │   ├── security.py         # JWT Auth, Firebase Dependency
│   │   └── database.py         # SQLAlchemy & PostGIS Engine
│   ├── api/
│   │   ├── dependencies.py     # get_db, current_user injects
│   │   └── v1/
│   │       ├── auth.py         # Token swap endpoints
│   │       ├── incidents.py    # Core ingestion /report
│   │       ├── websockets.py   # Socket endpoints for dashboards
│   ├── models/
│   │   └── incident.py         # ORM: Geometry mapping
│   ├── schemas/
│   │   └── incident_dto.py     # Pydantic strictly-typed models
│   └── agents/                 # Multi-Agent Coordination System
│       ├── orchestrator.py     
│       └── severity_agent.py   
├── Dockerfile                  # Uvicorn Gunicorn configuration
└── requirements.txt            # FastAPI, GeoAlchemy2, Google GenAI`}
              </pre>
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              The application utilizes a domain-driven design, decoupling the
              API routing layer (<code className="text-blue-300">api/v1</code>)
              from the business logic and AI processing threads (
              <code className="text-blue-300">agents/</code>).
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "core",
      title: "Core Main & Middleware",
      icon: TerminalSquare,
      content: (
        <div className="space-y-4">
          <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-xl">
            <h4 className="text-white font-bold flex items-center gap-2 mb-3">
              <TerminalSquare className="w-4 h-4 text-blue-400" /> app/main.py
            </h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 overflow-x-auto text-[10px] sm:text-xs font-mono">
              <pre className="text-emerald-300">
                {`from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api_router import api_router

app = FastAPI(title="RoadGuardian AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "ok", "agents_active": True}`}
              </pre>
            </div>
          </div>
          <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-xl">
            <h4 className="text-white font-bold flex items-center gap-2 mb-3">
              <Key className="w-4 h-4 text-rose-400" /> Firebase JWT Middleware
            </h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 overflow-x-auto text-[10px] sm:text-xs font-mono">
              <pre className="text-amber-300">
                {`from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth

security = HTTPBearer()

def verify_firebase_token(creds: HTTPAuthorizationCredentials = Depends(security)):
    try:
        return auth.verify_id_token(creds.credentials)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")`}
              </pre>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "controllers",
      title: "Controllers & Orchestration",
      icon: Code,
      content: (
        <div className="space-y-4">
          <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-xl">
            <h4 className="text-white font-bold flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-emerald-400" /> Async Controller
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              Emergency reports immediately trigger background Multi-Agent
              orchestration to prevent REST thread blocking.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 overflow-x-auto text-[10px] sm:text-xs font-mono">
              <pre className="text-blue-300">
                {`@router.post("/report", response_model=IncidentResponse)
async def report_emergency(
    payload: IncidentCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # 1. Save raw report state
    incident = triage_service.create_raw_incident(db, payload)
    
    # 2. Trigger Multi-Agent Orchestrator asynchronously
    background_tasks.add_task(run_orchestrator, incident.id, db)
    
    # 3. Return tracking ID immediately
    return incident`}
              </pre>
            </div>
          </div>

          <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-xl">
            <h4 className="text-white font-bold flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-purple-400" /> The Orchestrator
            </h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 overflow-x-auto text-[10px] sm:text-xs font-mono">
              <pre className="text-purple-300">
                {`async def run_orchestrator(incident_id: str, db: Session):
    # Sequential Triage
    triage_result = await analyze_severity(incident_id)
    if triage_result.confidence < 0.85:
        return trigger_manual_override()
        
    # Concurrent Processing
    hospital, ambulance = await asyncio.gather(
        find_hospital(incident_id, triage_result.level),
        dispatch_ambulance(incident_id)
    )
    
    await broadcast_ws("DISPATCH_CONFIRMED", hospital.id)`}
              </pre>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "models",
      title: "ORM & Payloads",
      icon: FileJson,
      content: (
        <div className="space-y-4">
          <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-xl">
            <h4 className="text-white font-bold flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-amber-500" /> SQLAlchemy Models
              (PostGIS)
            </h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 overflow-x-auto text-[10px] sm:text-xs font-mono">
              <pre className="text-slate-300">
                {`from geoalchemy2 import Geometry
from sqlalchemy.dialects.postgresql import UUID

class Incident(Base):
    __tablename__ = "incidents"
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    severity = Column(String(20), nullable=False)
    status = Column(String(20), default="reported")
    location = Column(Geometry('POINT', srid=4326))
    assigned_hospital_id = Column(UUID, ForeignKey('hospitals.id'))`}
              </pre>
            </div>
          </div>

          <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-xl">
            <h4 className="text-white font-bold flex items-center gap-2 mb-3">
              <FileJson className="w-4 h-4 text-indigo-400" /> Pydantic Schemas
            </h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 overflow-x-auto text-[10px] sm:text-xs font-mono">
              <pre className="text-slate-300">
                {`from pydantic import BaseModel, ConfigDict

class IncidentCreate(BaseModel):
    reporter_phone: str | None = None
    transcription: str
    lat: float
    lng: float

class IncidentResponse(IncidentCreate):
    id: UUID
    status: str
    
    model_config = ConfigDict(from_attributes=True)`}
              </pre>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const activeSection = sections.find((s) => s.id === activeTab) || sections[0];

  return (
    <div className="flex flex-col lg:flex-row gap-8 bg-[#020617]/40 text-slate-100 p-8 md:p-12 rounded-[3.5rem] border border-cyan-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),_inset_0_0_20px_rgba(34,211,238,0.2)] relative overflow-hidden backdrop-blur-3xl min-h-[85vh] group/backend">
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(34,211,238,0.1)] pointer-events-none z-0"></div>

      {/* Slide Navigation */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 relative z-10 lg:border-r border-white/5 lg:pr-8">
        <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 shadow-inner">
          <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Code Generated
          </h4>
          <p className="text-[10px] text-emerald-100/70">
            The full FastAPI background codebase has been generated in{" "}
            <code className="bg-black/40 px-1 py-0.5 rounded text-emerald-300">
              /fastapi-backend
            </code>
            . Export to ZIP to retrieve the `.py` source files.
          </p>
        </div>
        <div className="mb-8">
          <div className="flex items-center gap-4 transition-transform duration-500 group-hover/backend:-translate-y-2">
            <div className="p-3 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.5)] border border-white/30 text-white">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-black text-xl tracking-tight leading-none drop-shadow-md">
                FASTAPI BACKEND
              </h3>
              <span className="text-xs text-blue-200/60 font-black uppercase tracking-widest block mt-2">
                PYTHON SERVICES ARCHITECTURE
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = sec.id === activeTab;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveTab(sec.id)}
                className={`w-full flex items-center gap-4 py-4 px-6 rounded-[2rem] text-left transition-all duration-300 cursor-pointer border ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-cyan-400/50 text-white shadow-[0_0_25px_rgba(34,211,238,0.4)] scale-105"
                    : "bg-black/20 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive
                      ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                      : "text-white/40 group-hover:text-white/80"
                  }`}
                />
                <span className="font-bold text-sm tracking-wide">
                  {sec.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Content Desk */}
      <div className="flex-1 p-8 md:p-12 rounded-[3.5rem] bg-black/40 backdrop-blur-2xl border border-white/5 relative z-10 shadow-[0_0_40px_rgba(0,0,0,0.3)] flex flex-col min-h-[500px]">
        <div className="flex items-center justify-between border-b border-white/10 pb-8 mb-8 shrink-0">
          <h2 className="text-white font-black text-3xl tracking-tight flex items-center gap-4 drop-shadow-md line-clamp-1">
            {React.createElement(activeSection.icon, {
              className:
                "w-8 h-8 text-cyan-400 shrink-0 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]",
            })}
            {activeSection.title}
          </h2>
          <div className="text-[10px] font-black tracking-widest uppercase border border-cyan-500/30 bg-black/50 text-cyan-400 px-4 py-2 rounded-xl shrink-0 shadow-inner">
            CODE SPEC
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {activeSection.content}
        </div>
      </div>
    </div>
  );
}
