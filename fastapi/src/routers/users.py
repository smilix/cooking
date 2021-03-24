from fastapi import APIRouter, HTTPException
from fastapi import Depends
from sqlalchemy.orm import Session

import crud
import schemas
from db import models
from internals import deps
from internals.config import settings

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.post("", response_model=schemas.User, )
def create_user(user: schemas.UserCreate, db: Session = Depends(deps.get_db)):
    if not settings.allow_registration:
        raise HTTPException(status_code=400, detail="Registration is disabled.")

    db_user = crud.user.get_user_by_login(db, login=user.login)
    if db_user:
        raise HTTPException(status_code=400, detail="Login already taken")
    return crud.user.create(db, obj_in=user)


@router.get("", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(deps.check_session_and_csrf)):
    return current_user

# TODO update

# @router.put("/", response_model=schemas.User)
# async def update_user(
#         current_user: models.User = Depends(deps.check_session)):
#     return current_user
