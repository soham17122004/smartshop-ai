import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getRecentlyViewed } from "../utils/recentlyViewed";

function RecentlyViewed() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(getRecentlyViewed());
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="trending-section">
      <div className="trending-header">
        <h2>🕒 Recently Viewed</h2>
        <p>Your recently viewed products</p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.asin}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

export default RecentlyViewed;