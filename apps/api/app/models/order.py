from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from decimal import Decimal


class Order(SQLModel, table=True):
    """Trading order (simulated)."""

    __tablename__ = "orders"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    account_id: UUID = Field(foreign_key="accounts.id", index=True)
    instrument_id: UUID = Field(foreign_key="instruments.id", index=True)
    
    # Order details
    order_type: str = Field(max_length=50)  # "market", "limit", "stop", "stop_limit", "take_profit", "trailing_stop"
    side: str = Field(max_length=10)  # "buy", "sell"
    size: Decimal = Field(max_digits=20, decimal_places=8)
    price: Optional[Decimal] = Field(default=None, max_digits=20, decimal_places=8)  # For limit orders
    stop_price: Optional[Decimal] = Field(default=None, max_digits=20, decimal_places=8)  # For stop orders
    
    # Order status
    status: str = Field(default="pending", max_length=50)  # "pending", "filled", "partial", "canceled", "rejected"
    
    # Execution details
    filled_size: Decimal = Field(default=Decimal("0"), max_digits=20, decimal_places=8)
    fill_price: Optional[Decimal] = Field(default=None, max_digits=20, decimal_places=8)
    slippage: Optional[Decimal] = Field(default=None, max_digits=10, decimal_places=6)
    commission: Decimal = Field(default=Decimal("0"), max_digits=20, decimal_places=8)
    
    # Leverage
    leverage: int = Field(default=1)
    margin_required: Decimal = Field(default=Decimal("0"), max_digits=20, decimal_places=8)
    
    # Bot reference (if placed by bot)
    bot_id: Optional[UUID] = Field(default=None, foreign_key="bots.id")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    filled_at: Optional[datetime] = Field(default=None)
    canceled_at: Optional[datetime] = Field(default=None)

    class Config:
        json_schema_extra = {
            "example": {
                "order_type": "market",
                "side": "buy",
                "size": 0.5,
                "status": "filled",
                "fill_price": 50000.00,
            }
        }
