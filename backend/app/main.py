import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import brands, capsules, flavor_notes
from app.seed import reset_data

# For testing purposes
inserted = reset_data()
print(f"Fresh database ready: {inserted} sample capsules.")


app = FastAPI(title="Capsule Tracker", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")],
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type"],
)
app.include_router(capsules.router)
app.include_router(brands.router)
app.include_router(flavor_notes.router)
