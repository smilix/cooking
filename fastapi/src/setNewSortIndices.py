from sqlalchemy.orm import Session

import crud
from db import database
from schemas import CategoryUpdate

if __name__ == '__main__':
    user_id = 1

    increment = 1000
    db: Session = database.SessionLocal()
    try:
        categories = crud.category.get_multi_by_owner(db, owner_id=user_id)
        categories.sort(key=lambda c: c.id)
        current = increment
        for cat in categories:
            # print(f"{cat.id}, {cat.name}")
            update = CategoryUpdate()
            update.sort_index = current
            crud.category.update(db, db_obj=cat, obj_in=update)
            current += increment
    finally:
        db.close()
