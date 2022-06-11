from typing import Optional

from pydantic import BaseModel, validator


class RecipeBase(BaseModel):
    name: str
    sub_title: Optional[str]
    description: Optional[str]
    ingredients: Optional[str]
    source: Optional[str]
    category_id: int
    marked: bool


class RecipeCreate(RecipeBase):
    marked: Optional[bool]


class RecipeUpdate(RecipeBase):
    name: Optional[str]
    category_id: Optional[int]
    marked: Optional[bool]


class Recipe(RecipeCreate):
    id: int
    owner_id: int
    photo: Optional[str]

    # @validator('photo', check_fields=False, pre=True)
    # def name_must_contain_space(cls, v):
    #     return v is not None

    class Config:
        orm_mode = True
