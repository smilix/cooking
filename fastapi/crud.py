from sqlalchemy.orm import Session

import models
import schemas
import userHandler


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_login(db: Session, login: str) -> models.User:
    return db.query(models.User).filter(models.User.login == login).first()


def get_users(db: Session):
    return db.query(models.User)


def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = userHandler.get_password_hash(user.password)
    db_user = models.User(login=user.login, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_categories(db: Session):
    return db.query(models.Category)


def create_category(db: Session, category: schemas.Category, user_id: int):
    db_cat = models.Category(**category.dict(), owner_id=user_id)
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat
