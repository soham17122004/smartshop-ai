from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from wishlist import router as wishlist_router
from cart import router as cart_router
from auth import router as auth_router
from orders_manager import (
    create_order,
    load_orders,
    update_order_status,
    cancel_order,
    request_return,
    get_admin_stats,
)

from services.recommendation import (
    recommend,
    search_products,
    get_product_details,
    get_all_brands,
    get_all_categories,
    get_products_by_brand,
    get_products_by_category,
    add_new_product,
    delete_product,
)

app = FastAPI(
    title="AI E-Commerce Recommendation API",
    version="4.0.0",
    description="AI Product Recommendation System using FastAPI",
    debug=True,
)

# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# Routes
# =====================================================

app.include_router(auth_router)
app.include_router(wishlist_router)
app.include_router(cart_router)

# =====================================================
# Home & Health
# =====================================================

@app.get("/")
def home():
    return {
        "message": "AI E-Commerce Recommendation API",
        "status": "Running",
        "version": "4.0.0"
    }

@app.get("/health")
def health():
    return {"status": "OK"}

# =====================================================
# Search Products
# =====================================================

@app.get("/search")
def search(query: str = Query(..., min_length=1)):
    return search_products(query)

# =====================================================
# Brands List & Filter
# =====================================================

@app.get("/brands")
def list_brands():
    return get_all_brands()

@app.get("/brand/{brand_name}")
def filter_by_brand(brand_name: str):
    return get_products_by_brand(brand_name)

# =====================================================
# Categories List & Filter
# =====================================================

@app.get("/categories")
def list_categories():
    return get_all_categories()

@app.get("/category/{category_name}")
def filter_by_category(category_name: str):
    return get_products_by_category(category_name)

# =====================================================
# Product Details (ASIN)
# =====================================================

@app.get("/product/{asin}")
def product_details(asin: str):
    product = get_product_details(asin)
    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )
    return product

# =====================================================
# AI Recommendations
# =====================================================

@app.get("/recommend/{asin}")
def get_recommendations(asin: str):
    return recommend(asin)

# =====================================================
# Product Management (Admin Add & Delete)
# =====================================================

class NewProductRequest(BaseModel):
    title: str
    brand: str = "Amazon"
    category: str = "General"
    description: str = ""
    price: float
    mrp: float = 0.0
    discount: float = 0.0
    image: str = ""

@app.post("/api/products")
def add_product_api(product_data: NewProductRequest):
    created = add_new_product(product_data.dict())
    return {"message": "Product added successfully", "product": created}

@app.delete("/api/products/{asin}")
def delete_product_api(asin: str):
    delete_product(asin)
    return {"message": "Product deleted successfully", "asin": asin}

# =====================================================
# Orders & Admin Endpoints
# =====================================================

class OrderRequest(BaseModel):
    name: str
    mobile: str
    email: str
    address: str
    payment: str
    items: list
    subtotal: float
    discount: float = 0.0
    delivery: float = 0.0
    total: float

class StatusUpdateRequest(BaseModel):
    status: str

@app.post("/api/orders")
def place_order_api(order_data: OrderRequest):
    new_order = create_order(order_data.dict())
    return {"message": "Order placed successfully", "order": new_order}

@app.get("/api/orders")
def get_orders_api():
    return load_orders()

@app.put("/api/orders/{order_id}/status")
def update_status_api(order_id: str, body: StatusUpdateRequest):
    updated = update_order_status(order_id, body.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Status updated successfully", "order": updated}

@app.get("/api/admin/stats")
def get_stats_api():
    return get_admin_stats()

# =====================================================
# Cancel & Return Order Endpoints
# =====================================================

@app.post("/api/orders/{order_id}/cancel")
def cancel_order_api(order_id: str):
    result = cancel_order(order_id)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("reason", "Cannot cancel order"))
    return {"message": "Order cancelled successfully", "order": result["order"]}

class ReturnRequest(BaseModel):
    reason: str

@app.post("/api/orders/{order_id}/return")
def return_order_api(order_id: str, body: ReturnRequest):
    result = request_return(order_id, body.reason)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("reason", "Cannot request return"))
    return {"message": "Return request submitted successfully", "order": result["order"]}