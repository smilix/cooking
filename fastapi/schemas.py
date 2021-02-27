from typing import List, Optional

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    login: Optional[str] = None


class UserBase(BaseModel):
    login: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class ItemBase(BaseModel):
    name: str
    description: Optional[str]


class Category(ItemBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True


class RecipeCreate(ItemBase):
    ingredients: Optional[str]
    category_id: int


class Recipe(RecipeCreate):
    id: int
    owner_id: int
    photo: Optional[str]

    class Config:
        orm_mode = True
