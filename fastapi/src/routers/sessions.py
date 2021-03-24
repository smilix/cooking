import secrets

from fastapi import APIRouter
from fastapi import Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from starlette import status
from starlette.responses import JSONResponse

import crud
from internals import deps
from internals.config import settings

router = APIRouter(
    prefix="/sessions",
    tags=["sessions"],
)


class LoginParam(BaseModel):
    login: str
    password: str


@router.post("")
async def login_for_access_token(login_data: LoginParam, db: Session = Depends(deps.get_db)):
    user = crud.user.authenticate_user(db, login_data.login, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = crud.user.create_access_token(data={
        "sub": user.login,
    })

    response = JSONResponse(content={"details": "ok"})
    response.set_cookie(settings.access_token_cookie_name, access_token, max_age=settings.token_expire_minutes * 60,
                        secure=settings.secure_cookie, httponly=True, samesite="strict")

    csrf_token = secrets.token_hex(12)
    response.set_cookie(settings.csrf_token_cookie_name, csrf_token, max_age=settings.token_expire_minutes * 60,
                        secure=settings.secure_cookie, httponly=False, samesite="strict")
    return response


@router.delete("", dependencies=[Depends(deps.check_session_and_csrf)])
async def logout():
    response = JSONResponse(content={"details": "ok"})
    response.delete_cookie(settings.access_token_cookie_name)
    response.delete_cookie(settings.csrf_token_cookie_name)
    return response
