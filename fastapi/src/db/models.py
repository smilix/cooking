from sqlalchemy import Column, Integer, String, ForeignKey

from db.base_class import Base, WithOwnerMixin


class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, unique=True, index=True)
    hashed_password = Column(String)


class Category(Base, WithOwnerMixin):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    owner_id = Column(Integer, ForeignKey("user.id"))


class Recipe(Base, WithOwnerMixin):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sub_title = Column(String)
    ingredients = Column(String)
    description = Column(String)
    source = Column(String)
    photo = Column(String)

    owner_id = Column(Integer, ForeignKey("user.id"))
    category_id = Column(Integer, ForeignKey("category.id"), nullable=False)
