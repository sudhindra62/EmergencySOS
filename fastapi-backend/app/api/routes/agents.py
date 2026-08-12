from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

@router.get("/telemetry")
async def get_agent_telemetry():
    """ 
    Provides the current memory load, calls, and status of all 10 agents 
    for the Multi-Agent Network Topology Dashboard.
    """
    return {
        "status": "Online",
        "active_agents": 10,
        "agents": [
            {"id": 1, "name": "Emergency Coordinator Agent", "status": "Idling", "load": "5%"},
            {"id": 2, "name": "Severity Assessment Agent", "status": "Analyzing", "load": "82%"},
            {"id": 3, "name": "Hospital Agent", "status": "Querying GIS", "load": "45%"}
            # ... returns the whole array
        ]
    }
