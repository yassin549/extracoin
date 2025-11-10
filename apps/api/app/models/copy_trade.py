from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from decimal import Decimal


class CopyTrade(SQLModel, table=True):
    """Copy trading execution log - tracks API calls to broker."""

    __tablename__ = "copy_trades"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    trading_account_id: UUID = Field(foreign_key="trading_accounts.id", index=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    order_id: UUID = Field(foreign_key="orders.id", index=True)
    
    # Trade details
    action: str = Field(max_length=20)  # open, close, modify
    symbol: str = Field(max_length=20)  # BTC/USD, EUR/USD, etc.
    side: str = Field(max_length=10)  # buy, sell
    quantity: Decimal = Field(max_digits=20, decimal_places=8)
    price: Decimal = Field(max_digits=20, decimal_places=8)
    
    # Broker integration
    broker_order_id: Optional[str] = Field(default=None, max_length=255)
    broker_response: Optional[str] = Field(default=None)  # JSON response from broker API
    
    # Execution status
    status: str = Field(max_length=20, default="pending")  
    # pending, sent, executed, failed, cancelled
    
    # API call details
    api_endpoint: Optional[str] = Field(default=None, max_length=500)
    request_payload: Optional[str] = Field(default=None)  # JSON request sent to broker
    response_code: Optional[int] = Field(default=None)
    error_message: Optional[str] = Field(default=None)
    
    # Timing
    sent_at: Optional[datetime] = Field(default=None)
    executed_at: Optional[datetime] = Field(default=None)
    failed_at: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Retry tracking
    retry_count: int = Field(default=0)
    max_retries: int = Field(default=3)

    class Config:
        json_schema_extra = {
            "example": {
                "trading_account_id": "123e4567-e89b-12d3-a456-426614174000",
                "order_id": "123e4567-e89b-12d3-a456-426614174001",
                "action": "open",
                "symbol": "BTC/USD",
                "side": "buy",
                "quantity": 0.1,
                "price": 45000.00,
                "status": "executed",
            }
        }
