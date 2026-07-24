from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import CredentialsException
from app.core.security import decode_token
from app.database import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise CredentialsException()
        user_id = int(payload["sub"])
    except (ValueError, KeyError, TypeError) as exc:
        raise CredentialsException() from exc

    user = await db.get(User, user_id)
    if user is None or not user.is_active:
        raise CredentialsException()
    return user
