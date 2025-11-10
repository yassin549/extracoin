"""Trading system API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, func
from typing import List, Optional
from datetime import datetime, timedelta
from decimal import Decimal
from uuid import UUID
import secrets

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.trading_account import TradingAccount
from app.models.trading_transaction import TradingTransaction
from app.models.trading_payout import TradingPayout
from app.models.copy_trade import CopyTrade
from app.models.kyc_submission import KYCSubmission
from app.schemas.trading import (
    TradingAccountCreate,
    TradingAccountResponse,
    TradingTransactionResponse,
    TradingPayoutCreate,
    TradingPayoutResponse,
    TradingPayoutUpdate,
    CopyTradeResponse,
    TradingDepositCreate,
    TradingDepositResponse,
    TradingAccountStats,
    TradingPerformance,
)

router = APIRouter()


def generate_account_number() -> str:
    """Generate unique trading account number."""
    year = datetime.now().year
    random_id = secrets.randbelow(999999)
    return f"OPT-{year}-{random_id:06d}"


# Trading Accounts
@router.post("/trading/accounts", response_model=TradingAccountResponse, status_code=status.HTTP_201_CREATED)
async def create_trading_account(
    account_data: TradingAccountCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new trading account for the user."""
    
    # Check KYC status
    kyc_result = await db.execute(
        select(KYCSubmission)
        .where(KYCSubmission.user_id == current_user.id)
        .order_by(KYCSubmission.created_at.desc())
    )
    kyc = kyc_result.scalar_one_or_none()
    
    if not kyc or kyc.status != "approved":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="KYC verification required. Please complete KYC verification first.",
        )
    
    # Check if user already has a trading account
    existing_result = await db.execute(
        select(TradingAccount).where(
            TradingAccount.user_id == current_user.id,
            TradingAccount.status != "closed"
        )
    )
    existing_account = existing_result.scalar_one_or_none()
    
    if existing_account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have an active trading account",
        )
    
    # Generate unique account number
    account_number = generate_account_number()
    while True:
        check_result = await db.execute(
            select(TradingAccount).where(TradingAccount.account_number == account_number)
        )
        if not check_result.scalar_one_or_none():
            break
        account_number = generate_account_number()
    
    # Create trading account
    trading_account = TradingAccount(
        user_id=current_user.id,
        account_number=account_number,
        name=account_data.name,
        status="active",  # Activate immediately since KYC is approved
        activated_at=datetime.utcnow(),
    )
    
    db.add(trading_account)
    await db.commit()
    await db.refresh(trading_account)
    
    return trading_account


@router.get("/trading/accounts", response_model=List[TradingAccountResponse])
async def get_user_trading_accounts(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all trading accounts for the current user."""
    result = await db.execute(
        select(TradingAccount)
        .where(TradingAccount.user_id == current_user.id)
        .order_by(TradingAccount.created_at.desc())
    )
    accounts = result.scalars().all()
    return accounts


@router.get("/trading/accounts/{account_id}", response_model=TradingAccountResponse)
async def get_trading_account(
    account_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific trading account."""
    result = await db.execute(
        select(TradingAccount).where(
            TradingAccount.id == account_id,
            TradingAccount.user_id == current_user.id
        )
    )
    account = result.scalar_one_or_none()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trading account not found",
        )
    
    return account


# Transactions
@router.get("/trading/accounts/{account_id}/transactions", response_model=List[TradingTransactionResponse])
async def get_trading_transactions(
    account_id: UUID,
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get transaction history for a trading account."""
    # Verify ownership
    account_result = await db.execute(
        select(TradingAccount).where(
            TradingAccount.id == account_id,
            TradingAccount.user_id == current_user.id
        )
    )
    account = account_result.scalar_one_or_none()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trading account not found",
        )
    
    # Get transactions
    result = await db.execute(
        select(TradingTransaction)
        .where(TradingTransaction.trading_account_id == account_id)
        .order_by(TradingTransaction.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    transactions = result.scalars().all()
    return transactions


# Deposits
@router.post("/trading/deposits", response_model=TradingDepositResponse)
async def create_trading_deposit(
    deposit_data: TradingDepositCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a deposit for a trading account using crypto payment."""
    # Verify account ownership
    account_result = await db.execute(
        select(TradingAccount).where(
            TradingAccount.id == deposit_data.trading_account_id,
            TradingAccount.user_id == current_user.id
        )
    )
    account = account_result.scalar_one_or_none()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trading account not found",
        )
    
    if account.status != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Trading account is not active",
        )
    
    # TODO: Integrate with NOWPayments or payment provider
    # For now, return mock response
    payment_id = f"TRDEP-{secrets.token_hex(8)}"
    
    return TradingDepositResponse(
        payment_id=payment_id,
        payment_address="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",  # Mock address
        amount=deposit_data.amount,
        currency=deposit_data.currency,
        pay_amount=deposit_data.amount,  # Will be calculated based on crypto price
        expiration_time=datetime.utcnow() + timedelta(hours=1),
        status="pending",
    )


# Payouts
@router.post("/trading/payouts", response_model=TradingPayoutResponse, status_code=status.HTTP_201_CREATED)
async def create_trading_payout(
    payout_data: TradingPayoutCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Request a payout from trading account."""
    # Verify account ownership
    account_result = await db.execute(
        select(TradingAccount).where(
            TradingAccount.id == payout_data.trading_account_id,
            TradingAccount.user_id == current_user.id
        )
    )
    account = account_result.scalar_one_or_none()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trading account not found",
        )
    
    # Check balance
    if account.available_balance < payout_data.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient balance. Available: ${account.available_balance}",
        )
    
    # Calculate fee (1%)
    fee_amount = payout_data.amount * Decimal("0.01")
    net_amount = payout_data.amount - fee_amount
    
    # Create payout request
    payout = TradingPayout(
        trading_account_id=account.id,
        user_id=current_user.id,
        amount=payout_data.amount,
        payout_method=payout_data.payout_method,
        destination=payout_data.destination,
        currency=payout_data.currency,
        status="pending",
        fee_amount=fee_amount,
        net_amount=net_amount,
        account_balance_at_request=account.balance,
    )
    
    db.add(payout)
    await db.commit()
    await db.refresh(payout)
    
    return payout


@router.get("/trading/payouts", response_model=List[TradingPayoutResponse])
async def get_user_trading_payouts(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all payout requests for the current user."""
    result = await db.execute(
        select(TradingPayout)
        .where(TradingPayout.user_id == current_user.id)
        .order_by(TradingPayout.created_at.desc())
    )
    payouts = result.scalars().all()
    return payouts


@router.get("/trading/payouts/{payout_id}", response_model=TradingPayoutResponse)
async def get_trading_payout(
    payout_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific payout request."""
    result = await db.execute(
        select(TradingPayout).where(
            TradingPayout.id == payout_id,
            TradingPayout.user_id == current_user.id
        )
    )
    payout = result.scalar_one_or_none()
    
    if not payout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payout not found",
        )
    
    return payout


# Copy Trades
@router.get("/trading/accounts/{account_id}/copy-trades", response_model=List[CopyTradeResponse])
async def get_copy_trades(
    account_id: UUID,
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get copy trade history for a trading account."""
    # Verify ownership
    account_result = await db.execute(
        select(TradingAccount).where(
            TradingAccount.id == account_id,
            TradingAccount.user_id == current_user.id
        )
    )
    account = account_result.scalar_one_or_none()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trading account not found",
        )
    
    # Get copy trades
    result = await db.execute(
        select(CopyTrade)
        .where(CopyTrade.trading_account_id == account_id)
        .order_by(CopyTrade.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    copy_trades = result.scalars().all()
    return copy_trades


# Statistics
@router.get("/trading/accounts/{account_id}/performance", response_model=TradingPerformance)
async def get_trading_performance(
    account_id: UUID,
    period: str = "30d",
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get performance metrics for a trading account."""
    # Verify ownership
    account_result = await db.execute(
        select(TradingAccount).where(
            TradingAccount.id == account_id,
            TradingAccount.user_id == current_user.id
        )
    )
    account = account_result.scalar_one_or_none()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trading account not found",
        )
    
    # Calculate period start date
    period_days = {
        "7d": 7,
        "30d": 30,
        "90d": 90,
        "1y": 365,
        "all": None,
    }
    
    days = period_days.get(period, 30)
    start_date = datetime.utcnow() - timedelta(days=days) if days else account.created_at
    
    # Get starting balance (first transaction in period or account initial balance)
    first_tx_result = await db.execute(
        select(TradingTransaction)
        .where(
            TradingTransaction.trading_account_id == account_id,
            TradingTransaction.created_at >= start_date
        )
        .order_by(TradingTransaction.created_at.asc())
        .limit(1)
    )
    first_tx = first_tx_result.scalar_one_or_none()
    starting_balance = first_tx.balance_before if first_tx else account.total_deposited
    
    # Calculate metrics
    ending_balance = account.balance
    profit_loss = ending_balance - starting_balance
    profit_loss_percentage = float((profit_loss / starting_balance * 100) if starting_balance > 0 else 0)
    
    win_rate = float((account.winning_trades / account.total_trades * 100) if account.total_trades > 0 else 0)
    
    return TradingPerformance(
        account_id=account.id,
        period=period,
        starting_balance=starting_balance,
        ending_balance=ending_balance,
        profit_loss=profit_loss,
        profit_loss_percentage=profit_loss_percentage,
        total_trades=account.total_trades,
        winning_trades=account.winning_trades,
        losing_trades=account.losing_trades,
        win_rate=win_rate,
        average_win=Decimal("0"),  # TODO: Calculate from transactions
        average_loss=Decimal("0"),  # TODO: Calculate from transactions
        largest_win=Decimal("0"),  # TODO: Calculate from transactions
        largest_loss=Decimal("0"),  # TODO: Calculate from transactions
        sharpe_ratio=None,  # TODO: Calculate if needed
    )
