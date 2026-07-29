import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaRobot,
  FaShoppingBag,
  FaBolt,
  FaEye,
  FaFire,
} from "react-icons/fa";
import { toast } from "react-toastify";

import { toggleWishlist, isWishlisted } from "../utils/wishlist";
import { useCurrency } from "../context/CurrencyContext";
import ProductQuickViewModal from "./ProductQuickViewModal";
import "../styles/ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [liked, setLiked] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  useEffect(() => {
    checkWishlist();
  }, [product.asin]);

  const checkWishlist = async () => {
    const state = await isWishlisted(product.asin);
    setLiked(state);
  };

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
    navigate("/checkout");
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const state = await toggleWishlist(product);
      setLiked(state);
      if (state) {
        toast.success("❤️ Added to Wishlist");
      } else {
        toast.info("💔 Removed from Wishlist");
      }
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.error(err);
      toast.error("Wishlist Error");
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <>
      <article className="product-card">
        {/* Top Floating Badges */}
        <div className="card-top-badges">
          {discount > 0 ? (
            <span className="discount-badge">
              <FaFire /> {discount}% OFF
            </span>
          ) : (
            <span className="tag-badge">{product.brand || "Amazon"}</span>
          )}

          <button
            className={`wishlist-btn ${liked ? "active" : ""}`}
            onClick={handleWishlist}
            title={liked ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        {/* Product Image Box with Hover Overlay */}
        <Link to={`/product/${product.asin}`} className="image-link">
          <div className="product-image">
            <img
              src={image}
              alt={product.title}
              loading="lazy"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";
              }}
            />
            <div className="image-overlay">
              <button className="quick-view-btn" onClick={handleQuickView}>
                <FaEye /> Quick View
              </button>
            </div>
          </div>
        </Link>

        {/* Content Info */}
        <div className="product-content">
          <div className="card-meta">
            <span className="brand-tag">{product.brand || "Amazon"}</span>
            <div className="rating">
              {renderStars()}
              <span className="rating-num">{rating.toFixed(1)}</span>
            </div>
          </div>

          <Link to={`/product/${product.asin}`} className="title-link">
            <h3 title={product.title}>{product.title}</h3>
          </Link>

          {/* Price & AI Score */}
          <div className="price-ai-row">
            <div className="price-box">
              <span className="price">{formatPrice(price)}</span>
              {mrp > 0 && <span className="mrp">{formatPrice(mrp)}</span>}
            </div>

            {product.similarity && (
              <div className="ai-score">
                <span className="pulse-dot"></span>
                <FaRobot />
                <span>{(product.similarity * 100).toFixed(0)}% Match</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="card-buttons">
            <button className="cart-btn" onClick={addToCart}>
              <FaShoppingBag /> Add to Cart
            </button>
            <button className="buy-btn" onClick={buyNow}>
              <FaBolt /> Buy Now
            </button>
          </div>
        </div>
      </article>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}

export default ProductCard;