from fastapi import APIRouter, Query
import httpx

router = APIRouter(tags=["research"])


@router.get("/research")
async def search_research(
    q: str = Query(..., min_length=2),
    rows: int = Query(5, ge=1, le=20),
):
    params = {"query": q, "rows": rows}
    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.get("https://api.crossref.org/works", params=params)
        response.raise_for_status()
        payload = response.json()
    items = payload.get("message", {}).get("items", [])
    return {"provider": "crossref", "query": q, "count": len(items), "results": items}
