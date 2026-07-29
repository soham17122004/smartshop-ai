from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import Base, get_db, engine
from models.users import User
from models.wishlist import Wishlist
from models.cart import Cart

from schemas import UserRegister, UserLogin

from security import (
    hash_password,
    verify_password,
    create_access_token,
)

router = APIRouter(tags=["Authentication"])

# Create database tables
Base.metadata.create_all(bind=engine)


# =====================================================
# Register
# =====================================================

@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):

    existing = db.query(User).filter(
        User.email == user.email.strip().lower()
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = User(
        full_name=user.full_name,
        email=user.email.strip().lower(),
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()

    return {
        "message": "Registration Successful"
    }


# =====================================================
# Login
# =====================================================

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    email_clean = user.email.strip().lower()

    # Primary Admin Credentials Configured by Owner
    ADMIN_EMAIL = "dobariyasoham@gmail.com"
    ADMIN_PASS = "Soham@1712"

    # Seed Admin Account if logging in with primary admin email
    if email_clean == ADMIN_EMAIL:
        db_admin = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if not db_admin:
            db_admin = User(
                full_name="Soham Dobariya (Admin)",
                email=ADMIN_EMAIL,
                password=hash_password(ADMIN_PASS)
            )
            db.add(db_admin)
            db.commit()
            db.refresh(db_admin)
        else:
            # Ensure password stays updated to requested password
            if not verify_password(ADMIN_PASS, db_admin.password):
                db_admin.password = hash_password(ADMIN_PASS)
                db.commit()
                db.refresh(db_admin)

    db_user = db.query(User).filter(
        User.email == email_clean
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    token = create_access_token(
        data={"sub": db_user.email}
    )

    is_admin = (
        email_clean == ADMIN_EMAIL or
        email_clean == "admin@smartshop.com" or
        "admin" in email_clean
    )

    return {
        "message": "Login Successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "full_name": db_user.full_name,
            "email": db_user.email,
            "role": "admin" if is_admin else "customer"
        }
    }