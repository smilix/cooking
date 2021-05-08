from sqlalchemy.orm import Session

from crud.base import CRUDBaseWithOwner, CRUDBase
from db.models import Category
from schemas.category import CategoryCreate, CategoryUpdate


class CRUDCategory(CRUDBase[Category, CategoryCreate, CategoryUpdate], CRUDBaseWithOwner[Category, CategoryCreate, CategoryUpdate]):

    def find_max_sort_index(self, db: Session) -> int:
        rs = db.execute("select max(sort_index) from Category")
        return rs.next()[0]


category: CRUDCategory = CRUDCategory(Category)
