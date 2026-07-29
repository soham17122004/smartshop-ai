import { useState } from "react";
import {
  FaFilter,
  FaSortAmountDown,
  FaStar,
  FaFire,
  FaUndo,
} from "react-icons/fa";
import "../styles/FilterToolbar.css";

function FilterToolbar({ onFilterChange, totalResults }) {
  const [minRating, setMinRating] = useState(0);
  const [minDiscount, setMinDiscount] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState("default");

  const handleRatingChange = (val) => {
    setMinRating(val);
    emitChange(val, minDiscount, maxPrice, sortBy);
  };

  const handleDiscountChange = (val) => {
    setMinDiscount(val);
    emitChange(minRating, val, maxPrice, sortBy);
  };

  const handlePriceChange = (val) => {
    setMaxPrice(val);
    emitChange(minRating, minDiscount, val, sortBy);
  };

  const handleSortChange = (val) => {
    setSortBy(val);
    emitChange(minRating, minDiscount, maxPrice, val);
  };

  const handleReset = () => {
    setMinRating(0);
    setMinDiscount(0);
    setMaxPrice(10000);
    setSortBy("default");
    onFilterChange({
      minRating: 0,
      minDiscount: 0,
      maxPrice: 10000,
      sortBy: "default",
    });
  };

  const emitChange = (r, d, p, s) => {
    onFilterChange({
      minRating: Number(r),
      minDiscount: Number(d),
      maxPrice: Number(p),
      sortBy: s,
    });
  };

  return (
    <div className="filter-toolbar">
      <div className="toolbar-top">
        <div className="toolbar-title">
          <FaFilter className="filter-icon" />
          <span>Filter & Sort Products</span>
          {totalResults !== undefined && (
            <span className="results-count">({totalResults} items)</span>
          )}
        </div>

        <button className="reset-filter-btn" onClick={handleReset}>
          <FaUndo /> Reset Filters
        </button>
      </div>

      <div className="toolbar-controls">
        {/* Sort By Dropdown */}
        <div className="control-group">
          <label>
            <FaSortAmountDown /> Sort By:
          </label>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="default">✨ AI Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
            <option value="discount">Highest Discount</option>
          </select>
        </div>

        {/* Rating Pills */}
        <div className="control-group">
          <label>
            <FaStar /> Min Rating:
          </label>
          <div className="pill-group">
            {[0, 3.5, 4.0, 4.5].map((val) => (
              <button
                key={val}
                className={`filter-pill ${minRating === val ? "active" : ""}`}
                onClick={() => handleRatingChange(val)}
              >
                {val === 0 ? "All" : `${val}★+`}
              </button>
            ))}
          </div>
        </div>

        {/* Discount Pills */}
        <div className="control-group">
          <label>
            <FaFire /> Min Discount:
          </label>
          <div className="pill-group">
            {[0, 10, 20, 30].map((val) => (
              <button
                key={val}
                className={`filter-pill ${
                  minDiscount === val ? "active" : ""
                }`}
                onClick={() => handleDiscountChange(val)}
              >
                {val === 0 ? "All" : `${val}%+`}
              </button>
            ))}
          </div>
        </div>

        {/* Max Price Range Slider */}
        <div className="control-group range-group">
          <label>Max Price: ₹{maxPrice.toLocaleString("en-IN")}</label>
          <input
            type="range"
            min="200"
            max="10000"
            step="200"
            value={maxPrice}
            onChange={(e) => handlePriceChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default FilterToolbar;
