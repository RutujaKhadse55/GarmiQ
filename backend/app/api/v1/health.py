from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def check_health():
    return {"status": "ok", "service": "garmiq-backend"}

@router.get("/ready")
def check_readiness():
    return {"status": "ready", "database": "connected"}
