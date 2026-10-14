from fastapi import APIRouter
from app.api.v1 import (
    health,
    heat_risk,
    heatmap,
    alerts,
    safe_places,
    reports
)

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(heat_risk.router, prefix="/heat-risk", tags=["Heat Risk"])
api_router.include_router(heatmap.router, prefix="/heatmap", tags=["Heatmap"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])
api_router.include_router(safe_places.router, prefix="/safe-places", tags=["Safe Places"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
