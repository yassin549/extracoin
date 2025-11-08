from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from decimal import Decimal


class Account(SQLModel, table=True):
    """Simulated trading account."""

    __tablename__ = "accounts"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    
    name: str = Field(max_length=255)  # e.g., "Demo Account", "Practice", "Strategy-1"
    base_currency: str = Field(default="USD", max_length=10)
    
    # Balance tracking
    balance: Decimal = Field(default=Decimal("0"), max_digits=20, decimal_places=2)
    equity: Decimal = Field(default=Decimal("0"), max_digits=20, decimal_places=2)
    margin_used: Decimal = Field(default=Decimal("0"), max_digits=20, decimal_places=2)
    margin_available: Decimal = Field(default=Decimal("0"), max_digits=20, decimal_places=2)
    
    # Account type
    is_demo: bool = Field(default=True)
    
    # Status
    is_active: bool = Field(default=True)
    
    # Risk limits
    max_leverage: int = Field(default=10)
    max_daily_loss: Optional[Decimal] = Field(default=None, max_digits=20, decimal_places=2)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Demo Account",
                "balance": 10000.00,
                "base_currency": "USD",
                "is_demo": True,
            }
        }
