from crud.base import CRUDBaseWithOwner, CRUDBase
from db.models import Category
from schemas.category import CategoryCreate, CategoryUpdate


class CRUDCategory(CRUDBase[Category, CategoryCreate, CategoryUpdate], CRUDBaseWithOwner[Category, CategoryCreate, CategoryUpdate]):
    pass


category: CRUDCategory = CRUDCategory(Category)
