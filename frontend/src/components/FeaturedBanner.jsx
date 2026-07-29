import { FaRobot, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/FeaturedBanner.css";

function FeaturedBanner() {
  return (
    <section className="featured-banner">

      <div className="banner-overlay"></div>

      <div className="banner-content">

        <span className="banner-tag">
          <FaRobot />
          AI Powered Shopping
        </span>

        <h1>
          Discover Products
          <br />
          Recommended Just For You
        </h1>

        <p>
          Our Machine Learning recommendation engine analyzes
          products and suggests the most relevant items based on
          similarity and user interests.
        </p>

        <Link to="/">
          <button className="banner-btn">
            Explore Products
            <FaArrowRight />
          </button>
        </Link>

      </div>

    </section>
  );
}

export default FeaturedBanner;