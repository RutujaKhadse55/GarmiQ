from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_reports_summary():
    return {
        "total_incidents": 14,
        "high_risk_wards": 3,
        "resolved": 11
    }
