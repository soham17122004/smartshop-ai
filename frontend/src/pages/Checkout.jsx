import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaArrowLeft,
  FaCheckCircle,
  FaTag,
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import api from "../api/axios";
import "../styles/Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    payment: "Cash On Delivery",
  });

  useEffect(() => {
    const singleProduct = JSON.parse(localStorage.getItem("checkoutProduct"));
    if (singleProduct) {
      setCart([{ ...singleProduct, quantity: 1 }]);
    } else {
      const items = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(items);
    }
  }, []);

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * (item.quantity || 1),
    0
  );

  const delivery = subtotal > 999 || subtotal === 0 ? 0 : 99;

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      couponDiscount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === "flat") {
      couponDiscount = appliedCoupon.value;
    }
  }

  const total = Math.max(0, subtotal - couponDiscount + delivery);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "SMART20") {
      setAppliedCoupon({ code: "SMART20", type: "percent", value: 20 });
      toast.success("🎉 Promo Code SMART20 Applied (20% OFF)");
    } else if (code === "WELCOME100") {
      setAppliedCoupon({ code: "WELCOME100", type: "flat", value: 100 });
      toast.success("🎉 Promo Code WELCOME100 Applied (₹100 OFF)");
    } else if (code === "AI50") {
      setAppliedCoupon({ code: "AI50", type: "percent", value: 50 });
      toast.success("🎉 Promo Code AI50 Applied (50% OFF)");
    } else {
      toast.error("Invalid Promo Code. Try SMART20 or WELCOME100");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async () => {
    if (
      !form.name ||
      !form.mobile ||
      !form.email ||
      !form.address
    ) {
      toast.warning("Please fill all the required fields.");
      return;
    }

    try {
      const orderPayload = {
        name: form.name,
        mobile: form.mobile,
        email: form.email,
        address: form.address,
        payment: form.payment,
        items: cart,
        subtotal: subtotal,
        discount: couponDiscount,
        delivery: delivery,
        total: total,
      };

      const res = await api.post("/api/orders", orderPayload);

      toast.success(`🎉 Order ${res.data.order.id} placed successfully!`);

      localStorage.removeItem("cart");
      localStorage.removeItem("checkoutProduct");

      window.dispatchEvent(new Event("cartUpdated"));

      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err) {
      console.error("Order Place Error:", err);
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="checkout-page">
        <div className="checkout-left">
          <h2>
            <FaMapMarkerAlt />
            Shipping Details
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />

          <textarea
            rows="5"
            name="address"
            placeholder="Full Address"
            value={form.address}
            onChange={handleChange}
          />

          <select
            name="payment"
            value={form.payment}
            onChange={handleChange}
          >
            <option>Cash On Delivery</option>
            <option>UPI</option>
            <option>Credit Card</option>
            <option>Debit Card</option>
          </select>
        </div>

        <div className="checkout-right">
          <h2>
            <FaCreditCard />
            Order Summary
          </h2>

          {cart.map((item) => (
            <div key={item.asin} className="summary-item">
              <img src={item.image} alt={item.title} />

              <div>
                <h4>{item.title}</h4>
                <p>Qty : {item.quantity}</p>
                <strong>
                  ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          ))}

          {/* Promo Code Box */}
          <div className="coupon-box">
            <h4>
              <FaTag /> Apply Promo Code
            </h4>
            <div className="coupon-input-row">
              <input
                type="text"
                placeholder="Enter promo code (e.g. SMART20)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button onClick={applyCoupon}>Apply</button>
            </div>
            {appliedCoupon && (
              <div className="applied-coupon-tag">
                <span>Code <strong>{appliedCoupon.code}</strong> Applied!</span>
                <button onClick={removeCoupon}>Remove ✕</button>
              </div>
            )}
          </div>

          <hr />

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          {appliedCoupon && (
            <div className="summary-row discount-row">
              <span>Coupon Discount ({appliedCoupon.code})</span>
              <span>- ₹{couponDiscount.toLocaleString("en-IN")}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Delivery</span>
            <span>{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>

          <button className="place-order-btn" onClick={placeOrder}>
            <FaCheckCircle />
            Place Order
          </button>

          <Link to="/cart">
            <button className="back-cart-btn">
              <FaArrowLeft />
              Back to Cart
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Checkout;