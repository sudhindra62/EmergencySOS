# BACKEND ARCHITECTURE: ROADGUARDIAN AI

## FastAPI Core Implementation

---

## 1. FOLDER STRUCTURE

```text
backend/
├── app/
│   ├── main.py                 # FastAPI Application Entrypoint
│   ├── core/
│   │   ├── config.py           # Environment Variables & Settings
│   │   ├── security.py         # Firebase JWT Validation, RBAC
│   │   └── database.py         # SQLAlchemy & PostGIS connection
│   ├── api/
│   │   ├── dependencies.py     # FastAPI Injection Dependencies
│   │   └── v1/
│   │       ├── api_router.py   # Global Versioned Router
│   │       ├── auth.py         # Authentication Endpoints
│   │       ├── incidents.py    # Emergency Report & Triage
│   │       ├── agents.py       # Interacting with AI Orchestrator
│   │       ├── analytics.py    # Time-series metrics
│   │       └── websockets.py   # Redis PubSub / Real-time sockets
│   ├── models/
│   │   ├── incident.py         # SQLAlchemy Model: Incidents
│   │   ├── user.py             # SQLAlchemy Model: Users
│   │   └── hospital.py         # SQLAlchemy Model: Hospitals
│   ├── schemas/
│   │   ├── incident.py         # Pydantic: IncidentBase, Create, Response
│   │   └── payload.py          # Pydantic: Multi-Agent Payloads
│   ├── services/
│   │   ├── auth_service.py     # Business logic for Users
│   │   ├── triage_service.py   # Dispatch and Routing logic
│   │   └── notification_service.py
│   └── agents/
│       ├── orchestrator.py     # Multi-Agent Workflow Core
│       ├── severity_agent.py   # Gemini Triage Wrapping
│       └── routing_agent.py    # PostGIS & OpenStreetMap Wrapping
├── requirements.txt
└── Dockerfile
```

---

## 2. CORE ENTRYPOINT (`app/main.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api_router import api_router
from app.api.v1.websockets import ws_router
from app.core.config import settings

app = FastAPI(
    title="RoadGuardian AI API",
    version="1.0.0",
    description="Enterprise-grade endpoint for Golden Hour emergency orchestration."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")
app.include_router(ws_router, prefix="/ws")

@app.get("/health")
def health_check():
    return {"status": "ok", "agents_active": True}
```

---

## 3. MODELS (`app/models/incident.py`)

```python
from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey
from geoalchemy2 import Geometry
from app.core.database import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    severity = Column(String(20), nullable=False)
    status = Column(String(20), default="reported")
    description = Column(String, nullable=True)
    location = Column(Geometry('POINT', srid=4326), nullable=False)
    assigned_hospital_id = Column(UUID(as_uuid=True), ForeignKey('hospitals.id'))
    created_at = Column(DateTime, server_default="now()")
```

---

## 4. MIDDLEWARE & SECURITY (`app/core/security.py`)

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import auth

security = HTTPBearer()

def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
```

---

## 5. CONTROLLERS & ROUTES (`app/api/v1/incidents.py`)

```python
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.schemas.incident import IncidentCreate, IncidentResponse
from app.services.triage_service import triage_incident
from app.core.security import verify_firebase_token
from app.api.dependencies import get_db

router = APIRouter()

@router.post("/report", response_model=IncidentResponse)
async def report_emergency(
    payload: IncidentCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Ingests an emergency. Immediately triggers the AI Orchestrator in the background.
    """
    # 1. Save raw report
    incident = triage_incident.create_raw_incident(db, payload)

    # 2. Trigger Multi-Agent Orchestrator asynchronously to prevent blocking
    background_tasks.add_task(triage_incident.run_orchestrator, incident.id, db)

    # 3. Return immediate tracking ID to frontend
    return incident
```

---

## 6. SERVICES & AI ORCHESTRATION (`app/agents/orchestrator.py`)

```python
from app.agents.severity_agent import analyze_severity
from app.agents.routing_agent import dispatch_ambulance, find_hospital
from app.services.notification_service import alert_dispatchers
import asyncio

async def run_orchestrator(incident_id: str, db):
    """
    The Core State Machine for the 10-Agent System.
    """
    # Step 1: Sequential NLP Triage
    triage_result = await analyze_severity(incident_id, db)

    if triage_result.confidence < 0.85:
        await alert_dispatchers(incident_id, "HUMAN_MANDATE_REQUIRED")
        return

    # Step 2: Concurrent API lookups for beds & fleets
    hospital_task = asyncio.create_task(find_hospital(incident_id, triage_result.level, db))
    ambulance_task = asyncio.create_task(dispatch_ambulance(incident_id, db))

    hospital, ambulance = await asyncio.gather(hospital_task, ambulance_task)

    # Step 3: Broadcast finalized state to WebSockets
    await broadcast_websocket_event(incident_id, "DISPATCH_CONFIRMED", {
        "hospital_id": hospital.id,
        "ambulance_id": ambulance.id,
        "eta_mins": ambulance.eta
    })
```
