import {
  FaLaptop,
  FaUtensils,
  FaSpa,
  FaTshirt,
  FaBath,
  FaPumpSoap,
  FaHeartbeat,
  FaArrowRight,
} from "react-icons/fa";

import "../styles/CategorySection.css";

const categories = [
  {
    name: "Skin Care",
    icon: <FaSpa />,
    gradient: "linear-gradient(135deg, #ec4899, #d946ef)",
    shadow: "rgba(236, 72, 153, 0.35)",
  },
  {
    name: "Grocery & Kitchen",
    icon: <FaUtensils />,
    gradient: "linear-gradient(135deg, #f97316, #ea580c)",
    shadow: "rgba(249, 115, 22, 0.35)",
  },
  {
    name: "Hair Care",
    icon: <FaPumpSoap />,
    gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    shadow: "rgba(139, 92, 246, 0.35)",
  },
  {
    name: "Fragrance",
    icon: <FaSpa />,
    gradient: "linear-gradient(135deg, #a855f7, #9333ea)",
    shadow: "rgba(168, 85, 247, 0.35)",
  },
  {
    name: "Bath & Home",
    icon: <FaBath />,
    gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
    shadow: "rgba(6, 182, 212, 0.35)",
  },
  {
    name: "Electronics",
    icon: <FaLaptop />,
    gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
    shadow: "rgba(59, 130, 246, 0.35)",
  },
  {
    name: "Fashion & Wear",
    icon: <FaTshirt />,
    gradient: "linear-gradient(135deg, #6366f1, #4f46e5)",
    shadow: "rgba(99, 102, 241, 0.35)",
  },
  {
    name: "Health & Care",
    icon: <FaHeartbeat />,
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    shadow: "rgba(239, 68, 68, 0.35)",
  },
];

function CategorySection({ onCategoryClick }) {
  return (
    <section className="category-section">
      <div className="category-header">
        <div>
          <span className="category-badge">Browse Collections</span>
          <h2>Shop by Category</h2>
          <p>Discover products across popular shopping categories.</p>
        </div>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <div
            key={category.name}
            className="category-card"
            onClick={() => onCategoryClick(category.name)}
          >
            <div
              className="category-icon"
              style={{
                background: category.gradient,
                boxShadow: `0 8px 22px ${category.shadow}`,
              }}
            >
              {category.icon}
            </div>

            <h3>{category.name}</h3>

            <span className="category-explore-link">
              Explore <FaArrowRight />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;