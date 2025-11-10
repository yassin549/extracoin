from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from decimal import Decimal


class TradingAccount(SQLModel, table=True):
    """Real money trading account with simulated market execution."""

    __tablename__ = "trading_accounts"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    
    # Account identification
    account_number: str = Field(unique=True, index=True, max_length=50)
    name: str = Field(max_length=255, default="Trading Account")
    
    # Account status
    status: str = Field(max_length=20, default="pending_kyc")  
    # pending_kyc, active, suspended, frozen, closed
    
    # Balance tracking (real money deposited by user)
    balance: Decimal = Field(default=Decimal("0"), max_digits=20, decimal_places=2)
    available_balance: Decimal = Field(default=Decimal("0"), max_digits=20, decimal_places=2)
    reserved_balance: Decimal = Field(default=Decimal("0"), max_digits=20, decimal_places=2)  # For open positions
    
    # Cumulative tracking
    total_deposited: Decimal = Field(default=Decimal("0"), max_digits=20, decimal_places=2)
    total_withdrawn: Decimal = Field(default=Decimal("0"), max_digits=20, decimal_places=2)
    total_profit_loss: Decimal = Field(default=Decimal("0"), max_digits=20, decimal_places=2)
    
    # Trading statistics
    total_trades: int = Field(default=0)
    winning_trades: int = Field(default=0)
    losing_trades: int = Field(default=0)
    
    # Copy trading status
    copy_trading_enabled: bool = Field(default=True)
    broker_account_id: Optional[str] = Field(default=None, max_length=255)
    last_copy_trade_at: Optional[datetime] = Field(default=None)
    
    # Risk management
    max_position_size: Decimal = Field(default=Decimal("1000"), max_digits=20, decimal_places=2)
    max_daily_loss: Optional[Decimal] = Field(default=None, max_digits=20, decimal_places=2)
    max_leverage: int = Field(default=10)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    activated_at: Optional[datetime] = Field(default=None)
    suspended_at: Optional[datetime] = Field(default=None)
    closed_at: Optional[datetime] = Field(default=None)

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "123e4567-e89b-12d3-a456-426614174000",
                "account_number": "OPT-2024-001234",
                "name": "Trading Account",
                "status": "active",
                "balance": 5000.00,
                "copy_trading_enabled": True,
            }
        }
