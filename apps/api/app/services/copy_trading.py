"""Copy trading service - handles broker API integration."""

import httpx
import json
from typing import Optional, Dict, Any
from datetime import datetime
from decimal import Decimal
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.trading_account import TradingAccount
from app.models.order import Order
from app.models.copy_trade import CopyTrade
from app.models.trading_transaction import TradingTransaction
from app.core.config import settings


class CopyTradingService:
    """Service for copy trading to broker."""
    
    def __init__(self):
        # TODO: Add broker API configuration
        self.broker_api_url = "https://api.broker.example.com"  # Replace with actual broker
        self.broker_api_key = "YOUR_BROKER_API_KEY"  # Should be in config
        self.max_retries = 3
    
    async def should_copy_trade(
        self, 
        trading_account: TradingAccount,
        order: Order,
    ) -> bool:
        """Determine if an order should be copy traded."""
        
        # Check if copy trading is enabled
        if not trading_account.copy_trading_enabled:
            return False
        
        # Check if account is active
        if trading_account.status != "active":
            return False
        
        # Check if account has sufficient balance
        if trading_account.available_balance <= 0:
            return False
        
        # Check if order is simulated (we only copy real money orders)
        # In this system, orders from trading accounts should be copy traded
        return True
    
    async def execute_copy_trade(
        self,
        trading_account: TradingAccount,
        order: Order,
        db: AsyncSession,
    ) -> CopyTrade:
        """Execute a copy trade to the broker."""
        
        # Create copy trade record
        copy_trade = CopyTrade(
            trading_account_id=trading_account.id,
            user_id=trading_account.user_id,
            order_id=order.id,
            action="open",
            symbol=order.instrument_id,  # May need mapping
            side=order.side,
            quantity=order.quantity,
            price=order.price or Decimal("0"),
            status="pending",
        )
        
        db.add(copy_trade)
        await db.commit()
        await db.refresh(copy_trade)
        
        # Attempt to send to broker
        try:
            await self._send_to_broker(copy_trade, trading_account, order, db)
        except Exception as e:
            copy_trade.status = "failed"
            copy_trade.error_message = str(e)
            copy_trade.failed_at = datetime.utcnow()
            await db.commit()
            await db.refresh(copy_trade)
        
        return copy_trade
    
    async def _send_to_broker(
        self,
        copy_trade: CopyTrade,
        trading_account: TradingAccount,
        order: Order,
        db: AsyncSession,
    ) -> None:
        """Send order to broker API."""
        
        # Prepare broker API request
        endpoint = f"{self.broker_api_url}/v1/orders"
        
        payload = {
            "account_id": trading_account.broker_account_id or "default",
            "symbol": copy_trade.symbol,
            "side": copy_trade.side.upper(),
            "quantity": float(copy_trade.quantity),
            "type": order.order_type.upper(),
            "price": float(copy_trade.price) if copy_trade.price else None,
            "client_order_id": str(copy_trade.id),
        }
        
        headers = {
            "Authorization": f"Bearer {self.broker_api_key}",
            "Content-Type": "application/json",
        }
        
        copy_trade.api_endpoint = endpoint
        copy_trade.request_payload = json.dumps(payload)
        copy_trade.sent_at = datetime.utcnow()
        
        # Make API request
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.post(
                    endpoint,
                    json=payload,
                    headers=headers,
                )
                
                copy_trade.response_code = response.status_code
                copy_trade.broker_response = response.text
                
                if response.status_code in [200, 201]:
                    # Success
                    response_data = response.json()
                    copy_trade.broker_order_id = response_data.get("order_id")
                    copy_trade.status = "executed"
                    copy_trade.executed_at = datetime.utcnow()
                    
                    # Update trading account
                    trading_account.last_copy_trade_at = datetime.utcnow()
                    
                else:
                    # Failed
                    copy_trade.status = "failed"
                    copy_trade.error_message = f"Broker API error: {response.status_code}"
                    copy_trade.failed_at = datetime.utcnow()
                    
                    # Retry if applicable
                    if copy_trade.retry_count < copy_trade.max_retries:
                        copy_trade.retry_count += 1
                        copy_trade.status = "pending"
            
            except httpx.TimeoutException:
                copy_trade.status = "failed"
                copy_trade.error_message = "Request timeout"
                copy_trade.failed_at = datetime.utcnow()
            
            except Exception as e:
                copy_trade.status = "failed"
                copy_trade.error_message = str(e)
                copy_trade.failed_at = datetime.utcnow()
        
        await db.commit()
    
    async def close_copy_trade(
        self,
        trading_account: TradingAccount,
        order: Order,
        db: AsyncSession,
    ) -> Optional[CopyTrade]:
        """Close a copy trade position on the broker."""
        
        # Find original copy trade
        result = await db.execute(
            select(CopyTrade).where(
                CopyTrade.trading_account_id == trading_account.id,
                CopyTrade.order_id == order.id,
                CopyTrade.status == "executed",
            )
        )
        original_copy_trade = result.scalar_one_or_none()
        
        if not original_copy_trade or not original_copy_trade.broker_order_id:
            return None
        
        # Create close copy trade record
        close_copy_trade = CopyTrade(
            trading_account_id=trading_account.id,
            user_id=trading_account.user_id,
            order_id=order.id,
            action="close",
            symbol=order.instrument_id,
            side=order.side,
            quantity=order.quantity,
            price=order.price or Decimal("0"),
            status="pending",
        )
        
        db.add(close_copy_trade)
        await db.commit()
        await db.refresh(close_copy_trade)
        
        # Send close request to broker
        try:
            endpoint = f"{self.broker_api_url}/v1/orders/{original_copy_trade.broker_order_id}/close"
            
            headers = {
                "Authorization": f"Bearer {self.broker_api_key}",
                "Content-Type": "application/json",
            }
            
            close_copy_trade.api_endpoint = endpoint
            close_copy_trade.sent_at = datetime.utcnow()
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(endpoint, headers=headers)
                
                close_copy_trade.response_code = response.status_code
                close_copy_trade.broker_response = response.text
                
                if response.status_code in [200, 201]:
                    close_copy_trade.status = "executed"
                    close_copy_trade.executed_at = datetime.utcnow()
                else:
                    close_copy_trade.status = "failed"
                    close_copy_trade.error_message = f"Broker API error: {response.status_code}"
                    close_copy_trade.failed_at = datetime.utcnow()
        
        except Exception as e:
            close_copy_trade.status = "failed"
            close_copy_trade.error_message = str(e)
            close_copy_trade.failed_at = datetime.utcnow()
        
        await db.commit()
        await db.refresh(close_copy_trade)
        
        return close_copy_trade
    
    async def update_account_balance_from_broker(
        self,
        trading_account: TradingAccount,
        db: AsyncSession,
    ) -> None:
        """Sync account balance with broker."""
        
        if not trading_account.broker_account_id:
            return
        
        try:
            endpoint = f"{self.broker_api_url}/v1/accounts/{trading_account.broker_account_id}/balance"
            
            headers = {
                "Authorization": f"Bearer {self.broker_api_key}",
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(endpoint, headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    broker_balance = Decimal(str(data.get("balance", 0)))
                    
                    # Calculate difference and update
                    balance_diff = broker_balance - trading_account.balance
                    
                    if abs(balance_diff) > Decimal("0.01"):  # Only if significant difference
                        # Create adjustment transaction
                        transaction = TradingTransaction(
                            trading_account_id=trading_account.id,
                            user_id=trading_account.user_id,
                            transaction_type="adjustment",
                            amount=balance_diff,
                            balance_before=trading_account.balance,
                            balance_after=broker_balance,
                            description=f"Balance sync with broker",
                        )
                        
                        trading_account.balance = broker_balance
                        trading_account.available_balance = broker_balance - trading_account.reserved_balance
                        
                        db.add(transaction)
                        await db.commit()
        
        except Exception as e:
            # Log error but don't fail
            print(f"Error syncing balance with broker: {e}")


# Global instance
copy_trading_service = CopyTradingService()
