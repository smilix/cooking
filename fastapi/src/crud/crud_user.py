from datetime import datetime, timedelta
from typing import Optional, Union, Dict, Any

from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from crud.base import CRUDBase
from db import models
from db.models import User
from internals.config import settings, JWT_ALGORITHM
from schemas import UserCreate, UserUpdate


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            login=obj_in.login,
            hashed_password=self.get_password_hash(obj_in.password),
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
            self,
            db: Session,
            *,
            db_obj: User,
            obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> User:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        if update_data["password"]:
            hashed_password = self.get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def get_user_by_login(self, db: Session, login: str) -> User:
        return db.query(User).filter(User.login == login).first()

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        return self.pwd_context.hash(password)

    def authenticate_user(self, db: Session, login: str, password: str) -> models.User or None:
        db_user = self.get_user_by_login(db, login)
        if not db_user:
            print(f"Login '{login}' not found.")
            return None
        if not self.verify_password(password, db_user.hashed_password):
            print("Password is wrong.")
            return None
        return db_user

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.token_expire_minutes)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=JWT_ALGORITHM)
        return encoded_jwt


user: CRUDUser = CRUDUser(User)
