from fastapi import APIRouter, Query
import httpx

router = APIRouter(tags=["geocoding"])


@router.get("/geocode")
async def geocode(q: str = Query(..., min_length=3)):
    headers = {"User-Agent": "shared-api-hub/0.1 contact=repository-owner"}
    params = {"q": q, "format": "jsonv2", "limit": 5, "addressdetails": 1}
    async with httpx.AsyncClient(timeout=15.0, headers=headers) as client:
        response = await client.get("https://nominatim.openstreetmap.org/search", params=params)
        response.raise_for_status()
        data = response.json()
    return {"provider": "nominatim", "query": q, "results": data}
