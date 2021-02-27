from sqlalchemy import Column, Integer, String, ForeignKey

from database import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    # items = relationship("Item", back_populates="owner")


class Category(Base):
    __tablename__ = "category"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    owner_id = Column(Integer, ForeignKey("user.id"))

    # owner = relationship("User", back_populates="items")


class Recipe(Base):
    __tablename__ = "recipe"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    ingredients = Column(String)
    description = Column(String)
    photo = Column(String)

    owner_id = Column(Integer, ForeignKey("user.id"))
    category_id = Column(Integer, ForeignKey("category.id"), nullable=False)
