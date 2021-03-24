import os
import shutil
import traceback
from typing import Optional

from PIL import Image
from fastapi import UploadFile

from crud.base import CRUDBaseWithOwner, CRUDBase
from db.models import Recipe
from internals import util
from internals.config import settings
from schemas import RecipeCreate, RecipeUpdate


class CRUDRecipe(CRUDBase[Recipe, RecipeCreate, RecipeUpdate], CRUDBaseWithOwner[Recipe, RecipeCreate, RecipeUpdate]):

    def get_photo_path(self, name: str) -> str:
        return os.path.join(settings.upload_folder, name)

    def handle_image(self, *, user_id: int, recipe_id: int, image: UploadFile) -> Optional[str]:
        # check image file
        try:
            img = Image.open(image.file)
            img.verify()
        except Exception:
            traceback.print_exc()
            return None

        rnd_part = util.get_random_string(6)
        name = f"{user_id}_{recipe_id}_{img.width}x{img.height}_{rnd_part}.{img.format}"

        if not os.path.exists(settings.upload_folder):
            os.makedirs(settings.upload_folder, exist_ok=True)

        destination = self.get_photo_path(name)
        print(f"Copy to: {destination}")

        # back to start (was moved by PILLOW)
        image.file.seek(0)
        with open(destination, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        return name


recipe: CRUDRecipe = CRUDRecipe(Recipe)
