from typing import Optional
from pydantic import BaseModel, EmailStr


class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr

    class Config:
        from_attributes = True


class CartItemCreate(BaseModel):
    asin: str
    title: str
    image: Optional[str] = None
    price: Optional[str] = None
    quantity: Optional[int] = 1


class CartItemUpdate(BaseModel):
    quantity: int