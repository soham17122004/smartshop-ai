import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaRobot,
  FaShoppingBag,
  FaBolt,
  FaExternalLinkAlt,
  FaFire,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "../styles/ProductQuickViewModal.css";

function ProductQuickViewModal({ product, isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen || !product) return null;

  const rating = Number(product.rating || 4.5);
  const image =
    product.image ||
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";
  const price = Number(product.price || 0);
  const mrp = Number(product.mrp || 0);
  const discount = Number(product.discount || 0);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.asin === product.asin);

    if (existing) {
      existing.quantity += 1;
      toast.info("🛒 Cart quantity updated");
    } else {
      cart.push({ ...product, quantity: 1 });
      toast.success("🛒 Added to Cart");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const buyNow = () => {
    localStorage.setItem("checkoutProduct", JSON.stringify(product));
    onClose();
    navigate("/checkout");
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quickview-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="quickview-grid">
          {/* Product Image Side */}
          <div className="quickview-image-box">
            {discount > 0 && (
              <span className="quickview-discount-tag">
                <FaFire /> {discount}% OFF
              </span>
            )}
            <img
              src={image}
              alt={product.title}
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";
              }}
            />
          </div>

          {/* Product Content Details */}
          <div className="quickview-details">
            <span className="quickview-brand">{product.brand || "Amazon"}</span>
            <h2>{product.title}</h2>

            <div className="quickview-rating-row">
              <div className="stars">{renderStars()}</div>
              <span>{rating.toFixed(1)} Rating</span>
            </div>

            <div className="quickview-price-row">
              <span className="quickview-price">
                ₹{price.toLocaleString("en-IN")}
              </span>
              {mrp > 0 && (
                <span className="quickview-mrp">
                  ₹{mrp.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {product.similarity && (
              <div className="quickview-ai-badge">
                <span className="pulse-dot"></span>
                <FaRobot />
                <span>{(product.similarity * 100).toFixed(0)}% AI Match Score</span>
              </div>
            )}

            <p className="quickview-desc">
              {product.description ||
                "High quality Amazon product recommended by AI algorithm based on feature similarity and user preference."}
            </p>

            <div className="quickview-actions">
              <button className="cart-btn" onClick={addToCart}>
                <FaShoppingBag /> Add to Cart
              </button>
              <button className="buy-btn" onClick={buyNow}>
                <FaBolt /> Buy Now
              </button>
            </div>

            <Link
              to={`/product/${product.asin}`}
              className="quickview-full-link"
              onClick={onClose}
            >
              View Full Product Page <FaExternalLinkAlt />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductQuickViewModal;
