from fastapi import APIRouter, Query
import httpx

router = APIRouter(tags=["currency"])


@router.get("/fx")
async def get_fx(
    base: str = Query("AUD", min_length=3, max_length=3),
    quote: str = Query("INR", min_length=3, max_length=3),
):
    base = base.upper()
    quote = quote.upper()
    url = f"https://api.frankfurter.app/latest"
    params = {"from": base, "to": quote}
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        payload = response.json()
    return {
        "provider": "frankfurter",
        "base": base,
        "quote": quote,
        "rate": payload.get("rates", {}).get(quote),
        "date": payload.get("date"),
        "raw": payload,
    }
