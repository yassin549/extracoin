from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4


class User(SQLModel, table=True):
    """User model for authentication and profile."""

    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str = Field(max_length=255)
    is_verified: bool = Field(default=False)
    is_active: bool = Field(default=True)
    is_admin: bool = Field(default=False)

    # 2FA
    twofa_secret: Optional[str] = Field(default=None, max_length=255)
    twofa_enabled: bool = Field(default=False)

    # Subscription
    plan_id: Optional[str] = Field(default="free", max_length=50)
    stripe_customer_id: Optional[str] = Field(default=None, max_length=255)
    stripe_subscription_id: Optional[str] = Field(default=None, max_length=255)
    next_billing_date: Optional[datetime] = Field(default=None)

    # KYC
    kyc_status: str = Field(default="pending", max_length=50)  # pending, approved, rejected
    kyc_verified_at: Optional[datetime] = Field(default=None)

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = Field(default=None)

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "plan_id": "free",
                "is_verified": True,
            }
        }
