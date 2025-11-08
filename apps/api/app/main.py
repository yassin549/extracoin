from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
import os

# Import routers (will be created in Phase 3)
# from app.api import auth, market, accounts, orders, bots, backtests

app = FastAPI(
    title="Tunicoin API",
    description="Virtual CFD Futures Trading Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Tunicoin API",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for Docker"""
    return {"status": "healthy"}


# Register routers (will be added in Phase 3)
# app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
# app.include_router(market.router, prefix="/api/market", tags=["Market Data"])
# app.include_router(accounts.router, prefix="/api/accounts", tags=["Accounts"])
# app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
# app.include_router(bots.router, prefix="/api/bots", tags=["Bots"])
# app.include_router(backtests.router, prefix="/api/backtests", tags=["Backtests"])


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": str(type(exc).__name__)},
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
