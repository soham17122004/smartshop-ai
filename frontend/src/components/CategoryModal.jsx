import { useState, useEffect } from "react";
import api from "../api/axios";
import { FaLayerGroup, FaTimes, FaSearch, FaSpinner } from "react-icons/fa";
import "../styles/BrandModal.css"; // Reusing clean glass modal styles

function CategoryModal({ isOpen, onClose, onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/categories");
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Fetch Categories Error:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="brand-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <span
              className="brand-icon-pill"
              style={{
                background: "linear-gradient(135deg, #10b981, #059669)",
                boxShadow: "0 6px 18px rgba(16, 185, 129, 0.3)",
              }}
            >
              <FaLayerGroup />
            </span>
            <div>
              <h3>Explore All Product Categories</h3>
              <p>Select a category to view all its items</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-search">
          <FaSearch className="modal-search-icon" />
          <input
            type="text"
            placeholder="Search categories (e.g. Beauty, Electronics, Hair Care...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="brands-list-container">
          {loading ? (
            <div className="modal-loading">
              <FaSpinner className="spin" />
              <span>Loading categories...</span>
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="brands-grid">
              {filteredCategories.map((cat, idx) => (
                <button
                  key={idx}
                  className="brand-chip"
                  onClick={() => {
                    onSelectCategory(cat.name);
                    onClose();
                  }}
                >
                  <span className="brand-chip-name">{cat.name}</span>
                  <span
                    className="brand-chip-count"
                    style={{ color: "#10b981" }}
                  >
                    {cat.count} items
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="modal-empty">
              <p>No categories matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryModal;
