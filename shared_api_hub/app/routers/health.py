from fastapi import APIRouter

from app.registry import API_REGISTRY

router = APIRouter(tags=["health"])


@router.get("/health")
async def health():
    return {
        "status": "ok",
        "providers": len(API_REGISTRY),
        "registry": API_REGISTRY,
    }
