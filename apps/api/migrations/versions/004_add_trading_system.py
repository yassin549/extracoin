"""Add trading system tables for real money simulated trading

Revision ID: 004
Revises: 003
Create Date: 2025-11-10

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = '004'
down_revision = '003'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create trading system tables."""
    
    # 1. Trading Accounts Table
    op.create_table(
        'trading_accounts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False, index=True),
        sa.Column('account_number', sa.String(50), nullable=False, unique=True, index=True),
        sa.Column('name', sa.String(255), nullable=False, default='Trading Account'),
        sa.Column('status', sa.String(20), nullable=False, default='pending_kyc'),
        sa.Column('balance', sa.Numeric(20, 2), nullable=False, default=0),
        sa.Column('available_balance', sa.Numeric(20, 2), nullable=False, default=0),
        sa.Column('reserved_balance', sa.Numeric(20, 2), nullable=False, default=0),
        sa.Column('total_deposited', sa.Numeric(20, 2), nullable=False, default=0),
        sa.Column('total_withdrawn', sa.Numeric(20, 2), nullable=False, default=0),
        sa.Column('total_profit_loss', sa.Numeric(20, 2), nullable=False, default=0),
        sa.Column('total_trades', sa.Integer, nullable=False, default=0),
        sa.Column('winning_trades', sa.Integer, nullable=False, default=0),
        sa.Column('losing_trades', sa.Integer, nullable=False, default=0),
        sa.Column('copy_trading_enabled', sa.Boolean, nullable=False, default=True),
        sa.Column('broker_account_id', sa.String(255), nullable=True),
        sa.Column('last_copy_trade_at', sa.DateTime, nullable=True),
        sa.Column('max_position_size', sa.Numeric(20, 2), nullable=False, default=1000),
        sa.Column('max_daily_loss', sa.Numeric(20, 2), nullable=True),
        sa.Column('max_leverage', sa.Integer, nullable=False, default=10),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
        sa.Column('activated_at', sa.DateTime, nullable=True),
        sa.Column('suspended_at', sa.DateTime, nullable=True),
        sa.Column('closed_at', sa.DateTime, nullable=True),
    )
    
    # 2. Trading Transactions Table
    op.create_table(
        'trading_transactions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('trading_account_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('trading_accounts.id'), nullable=False, index=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False, index=True),
        sa.Column('transaction_type', sa.String(50), nullable=False),
        sa.Column('amount', sa.Numeric(20, 2), nullable=False),
        sa.Column('balance_before', sa.Numeric(20, 2), nullable=False),
        sa.Column('balance_after', sa.Numeric(20, 2), nullable=False),
        sa.Column('reference_id', sa.String(255), nullable=True),
        sa.Column('description', sa.String(500), nullable=True),
        sa.Column('extra_data', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=False, index=True),
    )
    
    # 3. Copy Trades Table
    op.create_table(
        'copy_trades',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('trading_account_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('trading_accounts.id'), nullable=False, index=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False, index=True),
        sa.Column('order_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('orders.id'), nullable=False, index=True),
        sa.Column('action', sa.String(20), nullable=False),
        sa.Column('symbol', sa.String(20), nullable=False),
        sa.Column('side', sa.String(10), nullable=False),
        sa.Column('quantity', sa.Numeric(20, 8), nullable=False),
        sa.Column('price', sa.Numeric(20, 8), nullable=False),
        sa.Column('broker_order_id', sa.String(255), nullable=True),
        sa.Column('broker_response', sa.Text, nullable=True),
        sa.Column('status', sa.String(20), nullable=False, default='pending'),
        sa.Column('api_endpoint', sa.String(500), nullable=True),
        sa.Column('request_payload', sa.Text, nullable=True),
        sa.Column('response_code', sa.Integer, nullable=True),
        sa.Column('error_message', sa.Text, nullable=True),
        sa.Column('sent_at', sa.DateTime, nullable=True),
        sa.Column('executed_at', sa.DateTime, nullable=True),
        sa.Column('failed_at', sa.DateTime, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('retry_count', sa.Integer, nullable=False, default=0),
        sa.Column('max_retries', sa.Integer, nullable=False, default=3),
    )
    
    # 4. Trading Payouts Table
    op.create_table(
        'trading_payouts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('trading_account_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('trading_accounts.id'), nullable=False, index=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False, index=True),
        sa.Column('amount', sa.Numeric(20, 2), nullable=False),
        sa.Column('payout_method', sa.String(50), nullable=False),
        sa.Column('destination', sa.String(500), nullable=False),
        sa.Column('currency', sa.String(10), nullable=False, default='USD'),
        sa.Column('status', sa.String(20), nullable=False, default='pending'),
        sa.Column('transaction_hash', sa.String(255), nullable=True),
        sa.Column('provider_transaction_id', sa.String(255), nullable=True),
        sa.Column('fee_amount', sa.Numeric(20, 2), nullable=False, default=0),
        sa.Column('net_amount', sa.Numeric(20, 2), nullable=False),
        sa.Column('reviewed_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('admin_notes', sa.Text, nullable=True),
        sa.Column('rejection_reason', sa.Text, nullable=True),
        sa.Column('account_balance_at_request', sa.Numeric(20, 2), nullable=False),
        sa.Column('requested_at', sa.DateTime, nullable=False),
        sa.Column('reviewed_at', sa.DateTime, nullable=True),
        sa.Column('approved_at', sa.DateTime, nullable=True),
        sa.Column('processed_at', sa.DateTime, nullable=True),
        sa.Column('completed_at', sa.DateTime, nullable=True),
        sa.Column('rejected_at', sa.DateTime, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=False, index=True),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )
    
    # Create indexes for performance
    op.create_index('ix_trading_accounts_status', 'trading_accounts', ['status'])
    op.create_index('ix_trading_transactions_type', 'trading_transactions', ['transaction_type'])
    op.create_index('ix_copy_trades_status', 'copy_trades', ['status'])
    op.create_index('ix_trading_payouts_status', 'trading_payouts', ['status'])


def downgrade() -> None:
    """Drop trading system tables."""
    op.drop_index('ix_trading_payouts_status', table_name='trading_payouts')
    op.drop_index('ix_copy_trades_status', table_name='copy_trades')
    op.drop_index('ix_trading_transactions_type', table_name='trading_transactions')
    op.drop_index('ix_trading_accounts_status', table_name='trading_accounts')
    
    op.drop_table('trading_payouts')
    op.drop_table('copy_trades')
    op.drop_table('trading_transactions')
    op.drop_table('trading_accounts')
