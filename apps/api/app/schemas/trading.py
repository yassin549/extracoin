"""Trading system schemas."""

from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from decimal import Decimal


# Trading Account Schemas
class TradingAccountCreate(BaseModel):
    """Schema for creating a trading account."""
    name: str = Field(default="Trading Account", max_length=255)


class TradingAccountResponse(BaseModel):
    """Schema for trading account response."""
    id: UUID
    user_id: UUID
    account_number: str
    name: str
    status: str
    balance: Decimal
    available_balance: Decimal
    reserved_balance: Decimal
    total_deposited: Decimal
    total_withdrawn: Decimal
    total_profit_loss: Decimal
    total_trades: int
    winning_trades: int
    losing_trades: int
    copy_trading_enabled: bool
    broker_account_id: Optional[str]
    created_at: datetime
    updated_at: datetime
    activated_at: Optional[datetime]

    class Config:
        from_attributes = True


# Trading Transaction Schemas
class TradingTransactionResponse(BaseModel):
    """Schema for trading transaction response."""
    id: UUID
    trading_account_id: UUID
    transaction_type: str
    amount: Decimal
    balance_before: Decimal
    balance_after: Decimal
    reference_id: Optional[str]
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Trading Payout Schemas
class TradingPayoutCreate(BaseModel):
    """Schema for creating a trading payout request."""
    trading_account_id: UUID
    amount: Decimal = Field(gt=0, description="Payout amount in USD")
    payout_method: str = Field(description="crypto, bank_transfer, or stripe")
    destination: str = Field(description="Wallet address, bank account, or email")
    currency: str = Field(default="USD", max_length=10)

    @validator('payout_method')
    def validate_payout_method(cls, v):
        allowed = ['crypto', 'bank_transfer', 'stripe']
        if v not in allowed:
            raise ValueError(f'payout_method must be one of {allowed}')
        return v


class TradingPayoutResponse(BaseModel):
    """Schema for trading payout response."""
    id: UUID
    trading_account_id: UUID
    user_id: UUID
    amount: Decimal
    payout_method: str
    destination: str
    currency: str
    status: str
    transaction_hash: Optional[str]
    provider_transaction_id: Optional[str]
    fee_amount: Decimal
    net_amount: Decimal
    reviewed_by: Optional[UUID]
    admin_notes: Optional[str]
    rejection_reason: Optional[str]
    account_balance_at_request: Decimal
    requested_at: datetime
    reviewed_at: Optional[datetime]
    approved_at: Optional[datetime]
    completed_at: Optional[datetime]
    rejected_at: Optional[datetime]

    class Config:
        from_attributes = True


class TradingPayoutUpdate(BaseModel):
    """Schema for admin updating payout."""
    status: str = Field(description="approved, rejected, or cancelled")
    admin_notes: Optional[str] = None
    rejection_reason: Optional[str] = None

    @validator('status')
    def validate_status(cls, v):
        allowed = ['approved', 'rejected', 'cancelled']
        if v not in allowed:
            raise ValueError(f'status must be one of {allowed}')
        return v


# Copy Trade Schemas
class CopyTradeResponse(BaseModel):
    """Schema for copy trade response."""
    id: UUID
    trading_account_id: UUID
    order_id: UUID
    action: str
    symbol: str
    side: str
    quantity: Decimal
    price: Decimal
    broker_order_id: Optional[str]
    status: str
    error_message: Optional[str]
    sent_at: Optional[datetime]
    executed_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


# Deposit for Trading Account
class TradingDepositCreate(BaseModel):
    """Schema for creating a trading account deposit."""
    trading_account_id: UUID
    amount: Decimal = Field(gt=0, description="Deposit amount in USD")
    currency: str = Field(default="usdt", description="Crypto currency for deposit")
    
    @validator('currency')
    def validate_currency(cls, v):
        allowed = ['btc', 'eth', 'usdt', 'usdc', 'ltc', 'trx', 'bnb']
        if v.lower() not in allowed:
            raise ValueError(f'currency must be one of {allowed}')
        return v.lower()


class TradingDepositResponse(BaseModel):
    """Schema for trading deposit response."""
    payment_id: str
    payment_address: str
    amount: Decimal
    currency: str
    pay_amount: Decimal
    expiration_time: datetime
    status: str

    class Config:
        from_attributes = True


# Statistics
class TradingAccountStats(BaseModel):
    """Schema for trading account statistics."""
    total_accounts: int
    active_accounts: int
    total_balance: Decimal
    total_deposited: Decimal
    total_withdrawn: Decimal
    total_profit_loss: Decimal
    total_trades: int
    win_rate: float


class TradingPerformance(BaseModel):
    """Schema for trading performance metrics."""
    account_id: UUID
    period: str  # 7d, 30d, 90d, 1y, all
    starting_balance: Decimal
    ending_balance: Decimal
    profit_loss: Decimal
    profit_loss_percentage: float
    total_trades: int
    winning_trades: int
    losing_trades: int
    win_rate: float
    average_win: Decimal
    average_loss: Decimal
    largest_win: Decimal
    largest_loss: Decimal
    sharpe_ratio: Optional[float]
