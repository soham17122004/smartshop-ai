import "../styles/StatsSection.css";
import {
  FaBoxOpen,
  FaTags,
  FaLayerGroup,
  FaRobot,
  FaBolt,
  FaChartLine,
  FaSearch,
  FaShieldAlt,
} from "react-icons/fa";

const stats = [
  {
    key: "products",
    icon: <FaBoxOpen />,
    number: "28,977+",
    title: "Products",
    subtitle: "Click to View Full Catalog",
    gradient: "linear-gradient(135deg, #6366f1, #4f46e5)",
    clickable: true,
    clickHint: "Click to View →",
    hintClass: "hint-indigo",
  },
  {
    key: "brands",
    icon: <FaTags />,
    number: "400+",
    title: "Popular Brands",
    subtitle: "Click to Explore All Brands",
    gradient: "linear-gradient(135deg, #f97316, #ea580c)",
    clickable: true,
    clickHint: "Click to Browse →",
    hintClass: "hint-orange",
  },
  {
    key: "categories",
    icon: <FaLayerGroup />,
    number: "120+",
    title: "Categories",
    subtitle: "Click to Browse Categories",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    clickable: true,
    clickHint: "Click to Explore →",
    hintClass: "hint-emerald",
  },
  {
    key: "ai",
    icon: <FaRobot />,
    number: "AI Engine",
    title: "Smart Recommendations",
    subtitle: "FastAPI & Cosine Similarity",
    gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  },
  {
    key: "tfidf",
    icon: <FaBolt />,
    number: "TF-IDF",
    title: "Machine Learning",
    subtitle: "NLP Content Filtering",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
  },
  {
    key: "accuracy",
    icon: <FaChartLine />,
    number: "95%",
    title: "Similarity Accuracy",
    subtitle: "High-Precision Match Score",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
  },
  {
    key: "search",
    icon: <FaSearch />,
    number: "< 100ms",
    title: "Instant Search",
    subtitle: "Sub-Second Query Speed",
    gradient: "linear-gradient(135deg, #0284c7, #0369a1)",
  },
  {
    key: "security",
    icon: <FaShieldAlt />,
    number: "100%",
    title: "Secure Checkout",
    subtitle: "Protected Order System",
    gradient: "linear-gradient(135deg, #ec4899, #db2777)",
  },
];

function StatsSection({ onSelectProducts, onOpenBrandModal, onOpenCategoryModal }) {
  const handleClick = (key) => {
    if (key === "products" && onSelectProducts) {
      onSelectProducts();
    } else if (key === "brands" && onOpenBrandModal) {
      onOpenBrandModal();
    } else if (key === "categories" && onOpenCategoryModal) {
      onOpenCategoryModal();
    }
  };

  return (
    <section className="stats-section">
      <div className="stats-header">
        <span className="stats-badge">AI Analytics</span>
        <h2>Recommendation Engine Statistics</h2>
        <p>
          Built using Machine Learning, TF-IDF vectorization, cosine similarity,
          and FastAPI to provide intelligent product recommendations.
        </p>
      </div>

      <div className="stats-grid">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`stat-card ${item.clickable ? "clickable-card" : ""}`}
            onClick={() => handleClick(item.key)}
          >
            <div
              className="stat-icon"
              style={{
                background: item.gradient,
              }}
            >
              {item.icon}
            </div>

            <h3>{item.number}</h3>
            <h4>{item.title}</h4>
            <p>{item.subtitle}</p>
            {item.clickable && (
              <span className={`click-hint ${item.hintClass || ""}`}>
                {item.clickHint}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsSection;