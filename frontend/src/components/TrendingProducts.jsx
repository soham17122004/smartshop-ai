import { FaFire } from "react-icons/fa";
import ProductCard from "./ProductCard";
import "../styles/TrendingProducts.css";

function TrendingProducts({ products = [] }) {
  const trending = Array.isArray(products)
    ? products.slice(0, 6)
    : [];

  if (trending.length === 0) {
    return (
      <section id="products" className="trending-section">
        <div className="section-header">
          <span className="section-badge">
            <FaFire />
            Trending
          </span>
          <h2>Trending Products</h2>
          <p>Our AI couldn't find trending products at the moment.</p>
        </div>

        <div className="empty-trending">
          <h1>📦</h1>
          <h3>No Trending Products Available</h3>
          <p>Please try again later or search for a product.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="trending-section">
      <div className="section-header">
        <span className="section-badge">
          <FaFire />
          Trending Products
        </span>

        <h2>Popular AI Recommendations</h2>

        <p>Discover the most popular products selected by our AI recommendation engine.</p>
      </div>

      <div className="products-grid">
        {trending.map((product) => (
          <ProductCard key={product.asin} product={product} />
        ))}
      </div>
    </section>
  );
}

export default TrendingProducts;