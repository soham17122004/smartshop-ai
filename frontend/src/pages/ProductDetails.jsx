import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import {
  FaShoppingCart,
  FaBolt,
  FaHeart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaRobot,
  FaTag,
  FaBoxOpen,
} from "react-icons/fa";

import { useCurrency } from "../context/CurrencyContext";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import ProductReviews from "../components/ProductReviews";
import Footer from "../components/Footer";
import "../styles/ProductDetails.css";

function ProductDetails() {
  const { asin } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track product view history for personalized AI feed
  useEffect(() => {
    if (asin) {
      let history = JSON.parse(localStorage.getItem("view_history")) || [];
      history = [asin, ...history.filter((id) => id !== asin)].slice(0, 10);
      localStorage.setItem("view_history", JSON.stringify(history));
    }
  }, [asin]);

  // Consolidated fetch function wrapped in useCallback
  const fetchProductData = useCallback(async () => {
    if (!asin) return;

    try {
      setLoading(true);

      // 1. Fetch main product details
      const productResponse = await api.get(`/product/${asin}`);
      setProduct(productResponse.data);

      // 2. Fetch recommendations
      try {
        const recommendationResponse = await api.get(`/recommend/${asin}`);

        if (Array.isArray(recommendationResponse.data)) {
          setRecommendations(recommendationResponse.data);
        } else {
          setRecommendations([]);
        }
      } catch (recError) {
        console.error("Recommendation Fetch Error:", recError);
        setRecommendations([]);
      }
    } catch (prodError) {
      console.error("Product Fetch Error:", prodError);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [asin]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const renderStars = () => {
    const rating = Number(product?.rating || 4.5);
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
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.asin === product.asin);

    if (existing) {
      existing.quantity += 1;
      toast.info("🛒 Cart quantity updated");
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
      toast.success("🛒 Added to Cart");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const buyNow = () => {
    if (!product) return;
    localStorage.setItem("checkoutProduct", JSON.stringify(product));
    navigate("/checkout");
  };

  const addWishlist = () => {
    if (!product) return;
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = wishlist.find((item) => item.asin === product.asin);

    if (exists) {
      toast.info("❤️ Already in Wishlist");
      return;
    }

    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));

    toast.success("❤️ Added to Wishlist");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-page">
          <h2>Loading Product...</h2>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="loading-page">
          <h2>Product Not Found</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="product-page">
        {/* Main Product Container */}
        <div className="details-container">
          <div className="details-image-card">
            <img
              src={
                product.image ||
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
              }
              alt={product.title || "Product Image"}
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";
              }}
            />
          </div>

          <div className="details-info">
            <p className="brand-name">{product.brand || "Amazon"}</p>

            <h1>{product.title}</h1>

            <div className="rating-row">
              <div className="stars">{renderStars()}</div>
              <span>{Number(product.rating || 4.5).toFixed(1)}</span>
            </div>

            <div className="price-box">
              <span className="price">
                {formatPrice(product.price)}
              </span>

              {Number(product.mrp) > 0 && (
                <span className="mrp">
                  {formatPrice(product.mrp)}
                </span>
              )}

              {Number(product.discount) > 0 && (
                <span className="discount">{product.discount}% OFF</span>
              )}
            </div>

            {product.similarity && (
              <div className="ai-box">
                <FaRobot />
                <strong>
                  AI Match {(product.similarity * 100).toFixed(0)}%
                </strong>
              </div>
            )}

            <div className="info-grid">
              <div>
                <FaTag />
                <strong>Brand</strong>
                <span>{product.brand || "Amazon"}</span>
              </div>

              <div>
                <FaBoxOpen />
                <strong>Category</strong>
                <span>{product.category || "General"}</span>
              </div>
            </div>

            <div className="button-group">
              <button className="cart-btn" onClick={addToCart}>
                <FaShoppingCart />
                Add to Cart
              </button>

              <button className="buy-btn" onClick={buyNow}>
                <FaBolt />
                Buy Now
              </button>

              <button className="wishlist-btn-large" onClick={addWishlist}>
                <FaHeart />
                Wishlist
              </button>
            </div>

            <div className="product-specs">
              <h3>Description</h3>
              <p className="description">
                {product.description ||
                  "High quality Amazon product recommended by AI algorithm based on feature similarity and user preference."}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <ProductReviews asin={asin} />

        {/* AI Recommended Products */}
        {recommendations.length > 0 && (
          <section className="recommended-section">
            <div className="recommended-header">
              <h2>🤖 AI Recommended Products</h2>
              <p>Products similar to this item</p>
            </div>

            <div className="products-grid">
              {recommendations.map((item) => (
                <ProductCard key={item.asin} product={item} />
              ))}
            </div>
          </section>
        )}
      </section>

      <Footer />
    </>
  );
}

export default ProductDetails;