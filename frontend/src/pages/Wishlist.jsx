import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeartBroken, FaArrowLeft } from "react-icons/fa";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

import { getWishlist } from "../utils/wishlist";

import "../styles/Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const loadWishlist = async () => {
    try {
      const data = await getWishlist();
      setWishlist(data);
    } catch (error) {
      console.error(error);
      setWishlist([]);
    }
  };

  useEffect(() => {
    loadWishlist();

    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener(
      "wishlistUpdated",
      handleWishlistUpdate
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        handleWishlistUpdate
      );
    };
  }, []);

  return (
    <>
      <Navbar />

      <div className="wishlist-container">

        <div className="wishlist-header">
          <h1>❤️ My Wishlist</h1>

          <p>
            {wishlist.length} Product
            {wishlist.length !== 1 && "s"} Saved
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-wishlist">

            <FaHeartBroken />

            <h2>Your Wishlist is Empty</h2>

            <p>
              Save your favourite products and they
              will appear here.
            </p>

            <Link to="/">
              <button className="continue-btn">
                <FaArrowLeft />
                Continue Shopping
              </button>
            </Link>

          </div>
        ) : (
          <div className="wishlist-grid">

            {wishlist.map((product) => (
              <ProductCard
                key={product.asin}
                product={product}
              />
            ))}

          </div>
        )}

      </div>
    </>
  );
}

export default Wishlist;