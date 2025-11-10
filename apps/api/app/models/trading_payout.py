from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from decimal import Decimal


class TradingPayout(SQLModel, table=True):
    """Payout requests for trading accounts."""

    __tablename__ = "trading_payouts"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    trading_account_id: UUID = Field(foreign_key="trading_accounts.id", index=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    
    # Payout details
    amount: Decimal = Field(max_digits=20, decimal_places=2, ge=0)
    payout_method: str = Field(max_length=50)  # crypto, bank_transfer, stripe
    destination: str = Field(max_length=500)  # Wallet address, bank account, email
    currency: str = Field(max_length=10, default="USD")
    
    # Processing
    status: str = Field(max_length=20, default="pending")  
    # pending, under_review, approved, processing, completed, rejected, cancelled
    
    transaction_hash: Optional[str] = Field(default=None, max_length=255)
    provider_transaction_id: Optional[str] = Field(default=None, max_length=255)
    
    # Fees
    fee_amount: Decimal = Field(default=Decimal("0"), max_digits=20, decimal_places=2)
    net_amount: Decimal = Field(max_digits=20, decimal_places=2)  # amount - fee
    
    # Admin review
    reviewed_by: Optional[UUID] = Field(default=None, foreign_key="users.id")
    admin_notes: Optional[str] = Field(default=None)
    rejection_reason: Optional[str] = Field(default=None)
    
    # Account balance snapshot at request time
    account_balance_at_request: Decimal = Field(max_digits=20, decimal_places=2)
    
    # Timestamps
    requested_at: datetime = Field(default_factory=datetime.utcnow)
    reviewed_at: Optional[datetime] = Field(default=None)
    approved_at: Optional[datetime] = Field(default=None)
    processed_at: Optional[datetime] = Field(default=None)
    completed_at: Optional[datetime] = Field(default=None)
    rejected_at: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "trading_account_id": "123e4567-e89b-12d3-a456-426614174000",
                "user_id": "123e4567-e89b-12d3-a456-426614174001",
                "amount": 2500.00,
                "payout_method": "crypto",
                "destination": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
                "currency": "USDT",
                "status": "pending",
                "net_amount": 2475.00,
                "fee_amount": 25.00,
            }
        }
