from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AlreadyExistsException, CredentialsException
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.schemas.user import Token, UserCreate


async def register_user(db: AsyncSession, data: UserCreate) -> User:
    existing = await db.scalar(select(User).where(User.email == data.email))
    if existing is not None:
        raise AlreadyExistsException("An account with this email already exists")

    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def authenticate_user(db: AsyncSession, email: str, password: str) -> User:
    user = await db.scalar(select(User).where(User.email == email))
    if user is None or not verify_password(password, user.hashed_password):
        raise CredentialsException("Incorrect email or password")
    return user


def issue_tokens(user: User) -> Token:
    subject = str(user.id)
    return Token(access_token=create_access_token(subject), refresh_token=create_refresh_token(subject))


async def refresh_access_token(db: AsyncSession, refresh_token: str) -> Token:
    try:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise CredentialsException("Invalid refresh token")
        user_id = int(payload["sub"])
    except (ValueError, KeyError, TypeError) as exc:
        raise CredentialsException("Invalid refresh token") from exc

    user = await db.get(User, user_id)
    if user is None or not user.is_active:
        raise CredentialsException("Invalid refresh token")
    return issue_tokens(user)
