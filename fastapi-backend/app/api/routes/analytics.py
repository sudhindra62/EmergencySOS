from fastapi import APIRouter

router = APIRouter()

@router.get("/golden-hour")
def golden_hour_stats():
    return {
        "success_rate": 0.942,
        "average_response_time_mins": 8.4,
        "incidents_saved_ytd": 1420,
        "ai_triage_accuracy": 0.985
    }

@router.get("/risk-zones")
def risk_zones():
    return [
        {"zone_id": "Z-441", "name": "Highway 45 - Mile 12", "risk_score": 0.88, "historical_accidents": 45, "polygon": "POLY((...))"},
        {"zone_id": "Z-442", "name": "Downtown Junction", "risk_score": 0.72, "historical_accidents": 21, "polygon": "POLY((...))"}
    ]
