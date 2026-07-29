from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.cart import Cart
from models.users import User
from schemas import CartItemCreate, CartItemUpdate
from security import get_current_user

router = APIRouter(
    prefix="/cart",
    tags=["Cart"]
)

# =====================================================
# Add Product to Cart
# =====================================================

@router.post("/")
def add_to_cart(
    data: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(Cart).filter(
        Cart.user_id == current_user.id,
        Cart.asin == data.asin
    ).first()

    qty_to_add = data.quantity if data.quantity and data.quantity > 0 else 1

    if existing:
        existing.quantity += qty_to_add
        db.commit()
        db.refresh(existing)

        return {
            "message": "Quantity Updated",
            "quantity": existing.quantity
        }

    cart_item = Cart(
        user_id=current_user.id,
        asin=data.asin,
        title=data.title,
        image=data.image,
        price=data.price,
        quantity=qty_to_add
    )

    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)

    return {
        "message": "Added To Cart"
    }


# =====================================================
# Get Cart
# =====================================================

@router.get("/")
def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).all()


# =====================================================
# Update Quantity
# =====================================================

@router.put("/{asin}")
def update_quantity(
    asin: str,
    data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Cart).filter(
        Cart.user_id == current_user.id,
        Cart.asin == asin
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if data.quantity <= 0:
        db.delete(item)
        db.commit()

        return {
            "message": "Removed from Cart"
        }

    item.quantity = data.quantity
    db.commit()
    db.refresh(item)

    return {
        "message": "Quantity Updated",
        "quantity": item.quantity
    }


# =====================================================
# Remove Single Product
# =====================================================

@router.delete("/{asin}")
def remove_from_cart(
    asin: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Cart).filter(
        Cart.user_id == current_user.id,
        Cart.asin == asin
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Removed from Cart"
    }


# =====================================================
# Clear Entire Cart
# =====================================================

@router.delete("/")
def clear_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).delete()
    db.commit()

    return {
        "message": "Cart cleared successfully"
    }