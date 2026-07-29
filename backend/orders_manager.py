import os
import json
import uuid
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ORDERS_FILE = os.path.join(BASE_DIR, "orders.json")

def load_orders():
    if not os.path.exists(ORDERS_FILE):
        # Default sample seed orders for immediate admin visualization
        sample_orders = [
          {
            "id": "ORD-1092",
            "name": "Alex Johnson",
            "mobile": "+91 98765 43210",
            "email": "alex@example.com",
            "address": "45 Park Avenue, Sector 12, Mumbai, 400001",
            "payment": "UPI",
            "items": [
              {
                "asin": "B08N5WRWNW",
                "title": "Lee posh Lactic Acid 60% Anti ageing Pigmentation",
                "price": 1299.0,
                "quantity": 1,
                "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
              }
            ],
            "subtotal": 1299.0,
            "discount": 200.0,
            "delivery": 0.0,
            "total": 1099.0,
            "status": "Processing",
            "timestamp": "2026-07-29 10:30:00"
          },
          {
            "id": "ORD-1091",
            "name": "Priya Sharma",
            "mobile": "+91 98123 55443",
            "email": "priya@example.com",
            "address": "78 MG Road, Indiranagar, Bengaluru, 560038",
            "payment": "Credit Card",
            "items": [
              {
                "asin": "B07H8DDR9R",
                "title": "Harveys Crunchy & Creame Gourmet Delicacies",
                "price": 850.0,
                "quantity": 2,
                "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
              }
            ],
            "subtotal": 1700.0,
            "discount": 0.0,
            "delivery": 0.0,
            "total": 1700.0,
            "status": "Shipped",
            "timestamp": "2026-07-29 09:15:00"
          }
        ]
        with open(ORDERS_FILE, "w") as f:
            json.dump(sample_orders, f, indent=2)
        return sample_orders

    try:
        with open(ORDERS_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return []

def save_orders(orders):
    with open(ORDERS_FILE, "w") as f:
        json.dump(orders, f, indent=2)

def create_order(data):
    orders = load_orders()
    
    order_id = f"ORD-{len(orders) + 1001}"
    new_order = {
        "id": order_id,
        "name": data.get("name", "Guest"),
        "mobile": data.get("mobile", ""),
        "email": data.get("email", ""),
        "address": data.get("address", ""),
        "payment": data.get("payment", "Cash On Delivery"),
        "items": data.get("items", []),
        "subtotal": float(data.get("subtotal", 0)),
        "discount": float(data.get("discount", 0)),
        "delivery": float(data.get("delivery", 0)),
        "total": float(data.get("total", 0)),
        "status": "Processing",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    orders.insert(0, new_order)
    save_orders(orders)
    return new_order

def update_order_status(order_id, new_status):
    orders = load_orders()
    for order in orders:
        if order["id"] == order_id:
            order["status"] = new_status
            save_orders(orders)
            return order
    return None

def cancel_order(order_id):
    """Cancel a Processing order. Returns the updated order or None if not found/ineligible."""
    orders = load_orders()
    for order in orders:
        if order["id"] == order_id:
            if order["status"] == "Processing":
                order["status"] = "Cancelled"
                order["cancelled_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                save_orders(orders)
                return {"success": True, "order": order}
            else:
                return {"success": False, "reason": f"Order cannot be cancelled. Current status: {order['status']}"}
    return {"success": False, "reason": "Order not found"}

def request_return(order_id, reason):
    """Submit a return/refund request for a Delivered order."""
    orders = load_orders()
    for order in orders:
        if order["id"] == order_id:
            if order["status"] == "Delivered":
                order["status"] = "Return Requested"
                order["return_reason"] = reason
                order["return_requested_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                save_orders(orders)
                return {"success": True, "order": order}
            else:
                return {"success": False, "reason": f"Returns can only be requested for Delivered orders. Current status: {order['status']}"}
    return {"success": False, "reason": "Order not found"}

def get_admin_stats():
    orders = load_orders()
    total_revenue = sum(o.get("total", 0) for o in orders)
    total_orders = len(orders)
    total_items_sold = sum(sum(item.get("quantity", 1) for item in o.get("items", [])) for o in orders)
    avg_order_value = round(total_revenue / total_orders, 2) if total_orders > 0 else 0

    return {
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "total_items_sold": total_items_sold,
        "avg_order_value": avg_order_value
    }
