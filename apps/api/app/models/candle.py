from sqlmodel import SQLModel, Field
from datetime import datetime
from uuid import UUID, uuid4
from decimal import Decimal


class Candle(SQLModel, table=True):
    """OHLCV candlestick data for charts."""

    __tablename__ = "candles"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    instrument_id: UUID = Field(foreign_key="instruments.id", index=True)
    
    # Timeframe
    timeframe: str = Field(index=True, max_length=10)  # "1m", "5m", "15m", "1h", "4h", "1d"
    
    # OHLCV data
    timestamp: datetime = Field(index=True)
    open: Decimal = Field(max_digits=20, decimal_places=8)
    high: Decimal = Field(max_digits=20, decimal_places=8)
    low: Decimal = Field(max_digits=20, decimal_places=8)
    close: Decimal = Field(max_digits=20, decimal_places=8)
    volume: Decimal = Field(default=Decimal("0"), max_digits=20, decimal_places=8)
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "timeframe": "1m",
                "timestamp": "2024-01-01T00:00:00Z",
                "open": 50000.00,
                "high": 50100.00,
                "low": 49900.00,
                "close": 50050.00,
                "volume": 125.5,
            }
        }
