from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from decimal import Decimal


class Position(SQLModel, table=True):
    """Open trading position."""

    __tablename__ = "positions"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    account_id: UUID = Field(foreign_key="accounts.id", index=True)
    instrument_id: UUID = Field(foreign_key="instruments.id", index=True)
    
    # Position details
    side: str = Field(max_length=10)  # "long", "short"
    size: Decimal = Field(max_digits=20, decimal_places=8)
    entry_price: Decimal = Field(max_digits=20, decimal_places=8)
    current_price: Optional[Decimal] = Field(default=None, max_digits=20, decimal_places=8)
    
    # P&L tracking
    unrealized_pnl: Decimal = Field(default=Decimal("0"), max_digits=20, decimal_places=2)
    realized_pnl: Decimal = Field(default=Decimal("0"), max_digits=20, decimal_places=2)
    
    # Margin
    leverage: int = Field(default=1)
    margin_used: Decimal = Field(max_digits=20, decimal_places=2)
    
    # Stop loss & Take profit
    stop_loss: Optional[Decimal] = Field(default=None, max_digits=20, decimal_places=8)
    take_profit: Optional[Decimal] = Field(default=None, max_digits=20, decimal_places=8)
    
    # Funding (for CFDs)
    funding_paid: Decimal = Field(default=Decimal("0"), max_digits=20, decimal_places=2)
    last_funding_at: Optional[datetime] = Field(default=None)
    
    # Status
    is_open: bool = Field(default=True, index=True)
    
    # Bot reference (if managed by bot)
    bot_id: Optional[UUID] = Field(default=None, foreign_key="bots.id")
    
    # Timestamps
    opened_at: datetime = Field(default_factory=datetime.utcnow)
    closed_at: Optional[datetime] = Field(default=None)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "side": "long",
                "size": 0.5,
                "entry_price": 50000.00,
                "unrealized_pnl": 250.00,
                "leverage": 10,
            }
        }
