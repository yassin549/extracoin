from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from decimal import Decimal


class Instrument(SQLModel, table=True):
    """Trading instrument (symbol) configuration."""

    __tablename__ = "instruments"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    
    # Symbol identification
    symbol: str = Field(unique=True, index=True, max_length=50)  # e.g., "BTC-USD", "ETH-USD"
    name: str = Field(max_length=255)  # e.g., "Bitcoin / US Dollar"
    instrument_type: str = Field(max_length=50)  # "crypto", "forex", "futures", "cfd"
    
    # Contract specifications
    tick_size: Decimal = Field(default=Decimal("0.01"), max_digits=20, decimal_places=8)
    contract_size: Decimal = Field(default=Decimal("1"), max_digits=20, decimal_places=8)
    base_currency: str = Field(max_length=10)
    quote_currency: str = Field(max_length=10)
    
    # Simulation parameters
    base_spread: Decimal = Field(default=Decimal("0.001"), max_digits=10, decimal_places=6)  # 0.1%
    funding_rate: Optional[Decimal] = Field(default=None, max_digits=10, decimal_places=6)
    slippage_factor: Decimal = Field(default=Decimal("0.0001"), max_digits=10, decimal_places=6)
    
    # Trading limits
    min_size: Decimal = Field(default=Decimal("0.01"), max_digits=20, decimal_places=8)
    max_size: Optional[Decimal] = Field(default=None, max_digits=20, decimal_places=8)
    
    # Status
    is_active: bool = Field(default=True)
    is_tradeable: bool = Field(default=True)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "symbol": "BTC-USD",
                "name": "Bitcoin / US Dollar",
                "instrument_type": "crypto",
                "tick_size": 0.01,
                "base_spread": 0.001,
            }
        }
