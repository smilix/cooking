from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette import status

import crud
import deps
import models
import schemas
import userHandler
from database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World2"}


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(deps.get_db)):
    db_user = crud.get_user_by_login(db, login=user.login)
    if db_user:
        raise HTTPException(status_code=400, detail="Login already taken")
    return crud.create_user(db, user)


@app.post("/session", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(deps.get_db)):
    user = userHandler.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = userHandler.create_access_token(data={"sub": user.login})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/items/")
async def read_items(token: str = Depends(deps.oauth2_scheme)):
    return {"token": token}


@app.get("/users/me/", response_model=schemas.User)
async def read_users_me(
        current_user: models.User = Depends(deps.get_current_user)):
    return current_user
