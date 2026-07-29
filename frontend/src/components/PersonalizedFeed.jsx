import { useState, useEffect } from "react";
import api from "../api/axios";
import { FaRobot, FaMagic, FaHistory } from "react-icons/fa";
import ProductCard from "./ProductCard";
import "../styles/PersonalizedFeed.css";

function PersonalizedFeed() {
  const [personalizedProducts, setPersonalizedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [basedOn, setBasedOn] = useState("");

  useEffect(() => {
    fetchPersonalizedFeed();
  }, []);

  const fetchPersonalizedFeed = async () => {
    try {
      setLoading(true);
      const history = JSON.parse(localStorage.getItem("view_history")) || [];

      if (history.length > 0) {
        const lastAsin = history[0];
        setBasedOn("Based on your recent product views");

        const response = await api.get(`/recommend/${lastAsin}`);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setPersonalizedProducts(response.data.slice(0, 4));
          setLoading(false);
          return;
        }
      }

      // Fallback if no history or empty response
      setBasedOn("Top AI Picks for you today");
      const fallbackResponse = await api.get("/search?query=beauty");
      if (Array.isArray(fallbackResponse.data)) {
        setPersonalizedProducts(fallbackResponse.data.slice(0, 4));
      }
    } catch (err) {
      console.error("Personalized Feed Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || personalizedProducts.length === 0) return null;

  return (
    <section className="personalized-section">
      <div className="personalized-container">
        <div className="personalized-header">
          <div className="personalized-title-box">
            <span className="personalized-badge">
              <FaRobot /> <FaMagic /> Personalized For You
            </span>
            <h2>Recommended Based On Your Interests</h2>
            <p className="based-on-sub">
              <FaHistory /> {basedOn}
            </p>
          </div>
        </div>

        <div className="products-grid">
          {personalizedProducts.map((product) => (
            <ProductCard key={product.asin} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PersonalizedFeed;
