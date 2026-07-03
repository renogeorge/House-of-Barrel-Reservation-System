"""
House of Barrel - Bar Reservation System API
Main FastAPI application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routes import menu
from routes import order
from routes.reservations import router as reservations_router
from routes.auth import router as auth_router
from routes import reports


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting House of Barrel Reservation System...")
    yield
    print("🛑 Shutting down...")


# ✅ Create app ONLY ONCE
app = FastAPI(
    title="House of Barrel Reservation System",
    lifespan=lifespan
)

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include all routers
app.include_router(order.router)
app.include_router(reservations_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(reports.router)
app.include_router(menu.router, prefix="/api")

@app.get("/")
async def root():
    return {"status": "API running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
