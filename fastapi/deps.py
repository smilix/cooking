from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from starlette import status

import crud
from config import ALGORITHM, SECRET_KEY
from database import SessionLocal

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="session")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        login: str = payload.get("sub")
        if login is None:
            raise credentials_exception
        # token_data = schemas.TokenData(login=login)
    except JWTError:
        raise credentials_exception
    db_user = crud.get_user_by_login(db, login)
    if db_user is None:
        raise credentials_exception
    return db_user
