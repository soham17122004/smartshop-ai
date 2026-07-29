import {
  FaRobot,
  FaShoppingBag,
  FaChartLine,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/Hero.css";

function Hero() {
  const scrollToProducts = () => {
    const section = document.getElementById("products");

    if (!section) return;

    const navbar = document.querySelector(".navbar");
    const navbarHeight = navbar ? navbar.offsetHeight : 90;

    const y =
      section.getBoundingClientRect().top +
      window.scrollY -
      navbarHeight -
      10;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  return (
    <section className="hero">
      <div className="hero-overlay"></div>

      <div className="hero-container">
        <div className="hero-left">
          <span className="hero-badge">
            <FaRobot />
            AI Powered Recommendation Engine
          </span>

          <h1>
            Find the Perfect Product
            <span> with Artificial Intelligence</span>
          </h1>

          <p>
            Explore thousands of Amazon products with our Machine Learning
            recommendation engine. Discover intelligent product recommendations
            based on TF-IDF and Cosine Similarity to find the most relevant
            products instantly.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={scrollToProducts}
            >
              <FaSearch />
              Explore Products
            </button>

            <Link to="/wishlist">
              <button className="secondary-btn">
                Wishlist
                <FaArrowRight />
              </button>
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <FaShoppingBag />
              <h2>28,977+</h2>
              <p>Products</p>
            </div>

            <div className="stat-card">
              <FaRobot />
              <h2>AI Powered</h2>
              <p>Recommendations</p>
            </div>

            <div className="stat-card">
              <FaChartLine />
              <h2>95%</h2>
              <p>Accuracy</p>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700"
              alt="AI Shopping"
            />

            <div className="hero-card-content">
              <h3>AI Recommendation</h3>

              <p>
                Discover similar products instantly using Machine Learning and
                AI-powered recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;