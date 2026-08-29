API_REGISTRY = {
    "open_meteo": {
        "category": "weather",
        "base_url": "https://api.open-meteo.com/v1",
        "auth": "none",
        "status": "active",
    },
    "frankfurter": {
        "category": "currency",
        "base_url": "https://api.frankfurter.app",
        "auth": "none",
        "status": "active",
    },
    "nominatim": {
        "category": "geocoding",
        "base_url": "https://nominatim.openstreetmap.org",
        "auth": "none",
        "status": "active",
        "notes": "Public instance has strict fair-use limits; identify the application via User-Agent.",
    },
    "crossref": {
        "category": "research",
        "base_url": "https://api.crossref.org",
        "auth": "none",
        "status": "active",
    },
}
