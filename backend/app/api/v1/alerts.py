from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_active_alerts():
    return {
        "alerts": [
            {
                "id": "alert-001",
                "severity": "HIGH",
                "headline": "Severe Heatwave Alert",
                "issued_at": "2026-06-15T09:00:00Z"
            }
        ]
    }
