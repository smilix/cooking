from typing import Optional

from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str
    description: Optional[str]
    sort_index: Optional[int]


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    name: Optional[str]


class Category(CategoryBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True
