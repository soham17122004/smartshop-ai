from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base


class Cart(Base):
    __tablename__ = "cart"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    asin = Column(String, nullable=False)
    title = Column(String, nullable=False)
    image = Column(String)
    price = Column(String)
    quantity = Column(Integer, default=1)