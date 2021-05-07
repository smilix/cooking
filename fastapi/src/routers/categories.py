import math
from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import crud
from internals import deps
import schemas
from db import models
from routers import not_found_ex

router = APIRouter(
    prefix="/categories",
    tags=["categories"],
)


@router.get("", response_model=List[schemas.Category])
def read_categories(
        db: Session = Depends(deps.get_db),
        current_user: models.User = Depends(deps.check_session_and_csrf)):
    cats = crud.category.get_multi_by_owner(db, owner_id=current_user.id)
    # for c in cats:
    #     c.sort_index = math.floor(c.sort_index / 1000)
    return cats


@router.post("", response_model=schemas.Category)
def create_category(
        *,
        db: Session = Depends(deps.get_db),
        current_user: models.User = Depends(deps.check_session_and_csrf),
        category_in: schemas.CategoryCreate):
    return crud.category.create_with_owner(db, obj_in=category_in, owner_id=current_user.id)


def _get(db: Session, user_id: int, cat_id: int) -> models.Category:
    cat: Optional[models.Category] = crud.category.get(db, id=cat_id)
    if not cat:
        raise not_found_ex

    if cat.owner_id != user_id:
        raise not_found_ex

    return cat


@router.put("/{id}", response_model=schemas.Category)
def update_category(
        *,
        db: Session = Depends(deps.get_db),
        current_user: models.User = Depends(deps.check_session_and_csrf),
        id: int,
        category_in: schemas.CategoryUpdate):
    cat = _get(db, current_user.id, id)
    return crud.category.update(db, db_obj=cat, obj_in=category_in)


@router.get("/{id}", response_model=schemas.Category)
def read_category(
        *,
        db: Session = Depends(deps.get_db),
        current_user: models.User = Depends(deps.check_session_and_csrf),
        id: int):
    return _get(db, current_user.id, id)


@router.delete("/{id}")
def delete_category(
        *,
        db: Session = Depends(deps.get_db),
        current_user: models.User = Depends(deps.check_session_and_csrf),
        id: int):
    cat = _get(db, current_user.id, id)
    crud.category.remove(db, id=cat.id)
    return {}
