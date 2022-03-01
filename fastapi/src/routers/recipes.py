import os
from glob import glob
from typing import List, Optional

from PIL import Image, ImageOps
from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi.params import File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

import crud
import schemas
from db import models
from internals import deps
from internals.config import settings
from routers import not_found_ex

router = APIRouter(
    prefix="/recipes",
    tags=["recipes"],
)


def _get(db: Session, user_id: int, recipe_id: int) -> models.Recipe:
    recipe: Optional[models.Recipe] = crud.recipe.get(db, id=recipe_id)
    if not recipe:
        raise not_found_ex

    if recipe.owner_id != user_id:
        raise not_found_ex

    return recipe


def _check_category(db: Session, user_id: int, category_id: int):
    cat = crud.category.get(db, category_id)
    if not cat:
        raise HTTPException(status_code=400, detail="Invalid category id.")

    if cat.owner_id != user_id:
        raise HTTPException(status_code=400, detail="Invalid category id.")


@router.get("", response_model=List[schemas.Recipe])
def read_recipes(
        db: Session = Depends(deps.get_db),
        current_user: models.User = Depends(deps.check_session_and_csrf)):
    return crud.recipe.get_multi_by_owner(db, owner_id=current_user.id)


@router.post("", response_model=schemas.Recipe)
def create_recipe(
        *,
        db: Session = Depends(deps.get_db),
        current_user: models.User = Depends(deps.check_session_and_csrf),
        recipe_in: schemas.RecipeCreate):
    _check_category(db, current_user.id, recipe_in.category_id)
    return crud.recipe.create_with_owner(db, obj_in=recipe_in, owner_id=current_user.id)


@router.put("/{id}", response_model=schemas.Recipe)
def update_recipe(
        *,
        db: Session = Depends(deps.get_db),
        current_user: models.User = Depends(deps.check_session_and_csrf),
        id: int,
        recipe_in: schemas.RecipeUpdate):
    recipe = _get(db, current_user.id, id)
    if recipe_in.category_id:
        _check_category(db, current_user.id, recipe_in.category_id)

    return crud.recipe.update(db, db_obj=recipe, obj_in=recipe_in)


@router.get("/{id}", response_model=schemas.Recipe)
def read_recipe(
        *,
        db: Session = Depends(deps.get_db),
        current_user: models.User = Depends(deps.check_session_and_csrf),
        id: int):
    return _get(db, current_user.id, id)


@router.delete("/{id}")
def delete_recipe(
        *,
        db: Session = Depends(deps.get_db),
        current_user: models.User = Depends(deps.check_session_and_csrf),
        id: int):
    recipe = _get(db, current_user.id, id)
    crud.recipe.remove(db, id=recipe.id)
    return {}


@router.post("/{id}/photo", response_model=schemas.Recipe)
async def upload_photo(
        *,
        db: Session = Depends(deps.get_db),
        current_user: models.User = Depends(deps.check_session_and_csrf),
        id: int,
        upload: UploadFile = File(...)):
    # exists recipe?
    recipe = _get(db, current_user.id, id)

    name = crud.recipe.handle_image(user_id=current_user.id, recipe_id=id, image=upload)
    if name is None:
        raise HTTPException(status_code=400, detail="Invalid image.")

    old_photo_name = recipe.photo
    updated_recipe = crud.recipe.update(db, db_obj=recipe, obj_in={"photo": name})

    if old_photo_name is not None and len(old_photo_name) > 0:
        # remove old photo and thumbnails
        old_images = glob(os.path.join(settings.upload_folder, f"{old_photo_name}*"))
        for file in old_images:
            print(f"Removing: {file}")
            os.remove(file)

    return updated_recipe


@router.get("/{id}/photo", description="size '<= 0' means the original image.")
async def get_photo(
        *,
        db: Session = Depends(deps.get_db),
        current_user: models.User = Depends(deps.check_session_and_csrf),
        id: int,
        size: int):
    recipe = _get(db, current_user.id, id)
    if not recipe.photo:
        raise not_found_ex

    photo_path = crud.recipe.get_photo_path(recipe.photo)
    if size <= 0:
        return FileResponse(photo_path)

    thumb_name = f"{recipe.photo}-{size}"
    thumb_path = crud.recipe.get_photo_path(thumb_name)
    if os.path.exists(thumb_path):
        return FileResponse(thumb_path, media_type="image/webp")

    print(f"Create thumbnail: {thumb_path}")
    with Image.open(photo_path) as img:
        if img.mode != "RGB":
            img = img.convert("RGB")
        img = ImageOps.exif_transpose(img)
        img.thumbnail((size, size))
        img.save(thumb_path, format="WEBP", quality=80)

    return FileResponse(thumb_path, media_type="image/webp")
