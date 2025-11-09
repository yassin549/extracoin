#!/usr/bin/env python3
"""
Generate a secure SECRET_KEY for production use.
Run this before deploying to Railway.
"""

import secrets

def generate_secret_key(length=32):
    """Generate a cryptographically secure random string."""
    return secrets.token_urlsafe(length)

if __name__ == "__main__":
    secret_key = generate_secret_key()
    print("\n" + "="*60)
    print("🔐 Generated SECRET_KEY for Production")
    print("="*60)
    print(f"\n{secret_key}\n")
    print("="*60)
    print("\n⚠️  IMPORTANT:")
    print("   1. Copy this key")
    print("   2. Add it to Railway environment variables as SECRET_KEY")
    print("   3. Keep it secret - never commit to Git!")
    print("   4. Store it safely in case you need it later")
    print("\n" + "="*60 + "\n")
