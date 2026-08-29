from fastapi import FastAPI

from app.routers import fx, geocode, health, research, weather

app = FastAPI(
    title="Shared API Hub",
    version="0.1.0",
    description="Reusable gateway for public/free APIs used across projects.",
)

app.include_router(health.router, prefix="/v1")
app.include_router(weather.router, prefix="/v1")
app.include_router(fx.router, prefix="/v1")
app.include_router(geocode.router, prefix="/v1")
app.include_router(research.router, prefix="/v1")


@app.get("/")
async def root():
    return {
        "service": "shared-api-hub",
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/v1/health",
    }
