from fastapi import APIRouter, Query

router = APIRouter()

@router.get("/")
def get_safe_places(
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    radius_km: float = 5.0
):
    return {
        "safe_places": [
            {
                "id": "shelter-01",
                "name": "Central Cooling Shelter",
                "category": "cooling_center",
                "lat": lat or 28.6139,
                "lon": lon or 77.2090,
                "amenities": ["air_conditioning", "drinking_water", "first_aid"]
            }
        ]
    }
