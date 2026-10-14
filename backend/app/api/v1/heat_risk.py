from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter()

@router.get("/")
def get_heat_risk(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude")
):
    return {
        "location": {"lat": lat, "lon": lon},
        "heat_index_celsius": 41.5,
        "risk_level": "EXTREME_WARNING",
        "advisory": "Avoid outdoor activities between 11 AM and 4 PM. Stay hydrated."
    }
