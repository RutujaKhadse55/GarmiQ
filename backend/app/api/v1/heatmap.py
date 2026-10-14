from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_heatmap_grid():
    return {
        "type": "FeatureCollection",
        "features": []
    }
