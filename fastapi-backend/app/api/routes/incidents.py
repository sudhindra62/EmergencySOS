from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List
from app.services.ai_orchestrator import orchestrator
from app.models.incident import SeverityLevel
import uuid

router = APIRouter()

class IncidentCreateReq(BaseModel):
    reporter_id: str
    location: dict # lat, lng, address
    audio_path: Optional[str] = None
    text_desc: Optional[str] = None
    image_paths: Optional[List[str]] = []

class IncidentResponse(BaseModel):
    incident_id: str
    status: str
    severity: str

@router.post("/", response_model=IncidentResponse)
async def report_incident(req: IncidentCreateReq, background_tasks: BackgroundTasks):
    """
    Primary ingestion endpoint for offline hashes, voice, or text reports.
    Delegates to the Emergency Coordinator Agent.
    """
    incident_id = str(uuid.uuid4())
    
    # Run the agentic triage in the background to prevent client blocking
    background_tasks.add_task(process_incident_pipeline, incident_id, req)
    
    return IncidentResponse(
        incident_id=incident_id,
        status="Ingesting",
        severity="Pending Assessment"
    )
    
async def process_incident_pipeline(incident_id: str, req: IncidentCreateReq):
    triage_result = await orchestrator.triage_incident(req.text_desc or "No text provided")
    dispatch_results = await orchestrator.dispatch_sequence(triage_result, req.location)
    # Post updates via WebSockets to Dashboard here (Notification Service)
    pass

@router.get("/{incident_id}")
async def get_incident(incident_id: str):
    """ Fetch live dispatch status of an incident """
    return {
        "incident_id": incident_id,
        "status": "Dispatched",
        "route_poly": "encoded_polyline_here",
        "assigned_hospital": "Apollo Trauma Center"
    }
