from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.wishlist import Wishlist
from models.users import User
from security import get_current_user

router = APIRouter(
    prefix="/wishlist",
    tags=["Wishlist"]
)


@router.post("/")
def add_to_wishlist(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    existing = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id,
        Wishlist.asin == data["asin"]
    ).first()

    if existing:
        return {"message": "Already in wishlist"}

    item = Wishlist(
        user_id=current_user.id,
        asin=data["asin"],
        title=data["title"],
        image=data.get("image"),
        price=data.get("price"),
    )

    db.add(item)
    db.commit()

    return {"message": "Added to wishlist"}


@router.get("/")
def get_wishlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    return db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id
    ).all()


@router.delete("/{asin}")
def remove_wishlist(
    asin: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    item = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id,
        Wishlist.asin == asin
    ).first()

    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    db.delete(item)
    db.commit()

    return {"message": "Removed from wishlist"}