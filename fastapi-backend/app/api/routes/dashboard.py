from fastapi import APIRouter

router = APIRouter()

@router.get("/active-incidents")
def get_active_incidents():
    return [
        {"id": "INC-084A", "severity": "CRITICAL", "status": "DISPATCHED", "latency_ms": 120, "location": "NH-45, Chengalpattu", "agents_active": 4},
        {"id": "INC-085B", "severity": "MODERATE", "status": "TRIAGED", "latency_ms": 45, "location": "OMR Toll Plaza", "agents_active": 2}
    ]

@router.get("/fleet-status")
def get_fleet_status():
    return {
        "total_ambulances": 142,
        "available_ambulances": 18,
        "dispatched_ambulances": 124,
        "drone_fleet_ready": True
    }
