from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from decimal import Decimal


class TradingTransaction(SQLModel, table=True):
    """Transaction history for trading accounts."""

    __tablename__ = "trading_transactions"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    trading_account_id: UUID = Field(foreign_key="trading_accounts.id", index=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    
    # Transaction details
    transaction_type: str = Field(max_length=50)  
    # deposit, withdrawal, trade_profit, trade_loss, fee, 
    # payout_approved, payout_rejected, adjustment
    
    amount: Decimal = Field(max_digits=20, decimal_places=2)
    balance_before: Decimal = Field(max_digits=20, decimal_places=2)
    balance_after: Decimal = Field(max_digits=20, decimal_places=2)
    
    # Reference information
    reference_id: Optional[str] = Field(default=None, max_length=255)  # Order ID, deposit ID, etc.
    description: Optional[str] = Field(default=None, max_length=500)
    
    # Additional metadata
    metadata: Optional[str] = Field(default=None)  # JSON string for flexible data
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "trading_account_id": "123e4567-e89b-12d3-a456-426614174000",
                "transaction_type": "deposit",
                "amount": 1000.00,
                "balance_before": 0.00,
                "balance_after": 1000.00,
                "description": "Crypto deposit BTC",
            }
        }
