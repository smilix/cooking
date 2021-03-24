import fastapi
from fastapi import Depends, HTTPException
from fastapi.openapi.models import SecuritySchemeType
from fastapi.security.base import SecurityBase
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from starlette import status
from starlette.requests import Request

import crud
from db import models
from db.database import SessionLocal
from internals.config import settings, JWT_ALGORITHM


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class CheckSession(SecurityBase):
    def __init__(self):
        # this triggers the 'lock' symbol on the swagger docs
        self.model = fastapi.openapi.models.OAuth2(flows=fastapi.openapi.models.OAuthFlows())
        self.scheme_name = self.__class__.__name__

    @staticmethod
    def make_excp(msg: str):
        return HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=msg,
        )

    async def __call__(self, request: Request, db: Session = Depends(get_db)) -> models.User:

        token = request.cookies.get(settings.access_token_cookie_name)
        if token is None:
            raise self.make_excp(f"Missing access token '{settings.access_token_cookie_name}'")

        csrf_cookie = request.cookies.get(settings.csrf_token_cookie_name)
        if csrf_cookie is None:
            raise self.make_excp(f"Missing csrf cookie '{settings.csrf_token_cookie_name}'")

        csrf_token = request.headers.get(settings.csrf_token_header_name)
        if csrf_token is None:
            # maybe as parameter?
            csrf_token = request.query_params.get(settings.csrf_token_header_name)
            if csrf_token is None:
                raise self.make_excp(f"Missing csrf header '{settings.csrf_token_header_name}'")

        try:
            payload = jwt.decode(token, settings.secret_key, algorithms=[JWT_ALGORITHM])
            login: str = payload.get("sub")
            if login is None:
                raise self.make_excp("Invalid token content.")
        except JWTError:
            raise self.make_excp("Invalid token.")

        if csrf_cookie != csrf_token:
            raise self.make_excp("Invalid csrf token.")

        db_user = crud.user.get_user_by_login(db, login)
        if db_user is None:
            raise self.make_excp("Could not validate credentials.")
        return db_user


check_session_and_csrf = CheckSession()
