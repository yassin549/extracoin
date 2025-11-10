"""
Script to make a user an admin.
Usage: python make_admin.py <email>
"""

import asyncio
import sys
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlmodel import select
from app.models.user import User
from app.core.config import settings

async def make_admin(email: str):
    """Make a user an admin by email."""
    
    # Create async engine
    engine = create_async_engine(
        settings.DATABASE_URL.replace('postgresql://', 'postgresql+asyncpg://'),
        echo=True
    )
    
    # Create session
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with async_session() as session:
        # Find user
        result = await session.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            print(f"❌ User with email '{email}' not found!")
            return False
        
        # Check if already admin
        if user.is_admin:
            print(f"✅ User '{email}' is already an admin!")
            return True
        
        # Make admin
        user.is_admin = True
        session.add(user)
        await session.commit()
        
        print(f"✅ Successfully made '{email}' an admin!")
        print(f"   User ID: {user.id}")
        print(f"   Email: {user.email}")
        print(f"   Is Admin: {user.is_admin}")
        return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python make_admin.py <email>")
        print("Example: python make_admin.py user@example.com")
        sys.exit(1)
    
    email = sys.argv[1]
    asyncio.run(make_admin(email))
