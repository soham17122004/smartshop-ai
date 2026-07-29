import { useState, useEffect } from "react";
import api from "../api/axios";
import { FaTags, FaTimes, FaSearch, FaSpinner } from "react-icons/fa";
import "../styles/BrandModal.css";

function BrandModal({ isOpen, onClose, onSelectBrand }) {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchBrands();
    }
  }, [isOpen]);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await api.get("/brands");
      if (Array.isArray(response.data)) {
        setBrands(response.data);
      } else {
        setBrands([]);
      }
    } catch (err) {
      console.error("Fetch Brands Error:", err);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="brand-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="brand-icon-pill">
              <FaTags />
            </span>
            <div>
              <h3>Explore All Store Brands</h3>
              <p>Select a brand to view all its available products</p>
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
            placeholder="Search brands (e.g. Amazon, Keratin, Philips...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="brands-list-container">
          {loading ? (
            <div className="modal-loading">
              <FaSpinner className="spin" />
              <span>Loading store brands...</span>
            </div>
          ) : filteredBrands.length > 0 ? (
            <div className="brands-grid">
              {filteredBrands.map((brand, idx) => (
                <button
                  key={idx}
                  className="brand-chip"
                  onClick={() => {
                    onSelectBrand(brand.name);
                    onClose();
                  }}
                >
                  <span className="brand-chip-name">{brand.name}</span>
                  <span className="brand-chip-count">{brand.count} items</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="modal-empty">
              <p>No brands matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BrandModal;
