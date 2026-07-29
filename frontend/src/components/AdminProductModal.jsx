import { useState } from "react";
import api from "../api/axios";
import { FaTimes, FaPlus, FaBox, FaTag, FaRupeeSign, FaImage } from "react-icons/fa";
import { toast } from "react-toastify";
import "../styles/AdminProductModal.css";

function AdminProductModal({ isOpen, onClose, onProductAdded }) {
  const [form, setForm] = useState({
    title: "",
    brand: "Amazon",
    category: "Skin Care",
    description: "",
    price: "",
    mrp: "",
    discount: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price) {
      toast.warning("Please enter Product Title and Price.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/products", {
        title: form.title,
        brand: form.brand || "Amazon",
        category: form.category || "General",
        description: form.description || "High quality product.",
        price: Number(form.price),
        mrp: Number(form.mrp || form.price * 1.2),
        discount: Number(form.discount || 15),
        image: form.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      });

      toast.success(`🎉 Product "${res.data.product.title}" added to store!`);
      onProductAdded(res.data.product);
      onClose();
    } catch (error) {
      console.error("Add Product Error:", error);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="admin-product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="modal-header">
          <span className="modal-badge">
            <FaBox /> Inventory Management
          </span>
          <h2>Add New Product to Store</h2>
          <p>Instantly publish new catalog items to the AI recommendation system.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-product-form">
          <div className="form-group">
            <label>Product Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Organic Vitamin C Face Serum 30ml"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Brand Name</label>
              <input
                type="text"
                name="brand"
                placeholder="e.g. Mamaearth, Nivea, Generic"
                value={form.brand}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option>Skin Care</option>
                <option>Grocery & Kitchen</option>
                <option>Hair Care</option>
                <option>Fragrance</option>
                <option>Bath & Home</option>
                <option>Electronics</option>
                <option>Fashion & Wear</option>
                <option>Health & Care</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Selling Price (₹) *</label>
              <input
                type="number"
                name="price"
                placeholder="e.g. 799"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>MRP (₹)</label>
              <input
                type="number"
                name="mrp"
                placeholder="e.g. 1299"
                value={form.mrp}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Discount (%)</label>
              <input
                type="number"
                name="discount"
                placeholder="e.g. 25"
                value={form.discount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="image"
              placeholder="https://images.unsplash.com/photo-..."
              value={form.image}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Product Description</label>
            <textarea
              rows="3"
              name="description"
              placeholder="Enter product details, ingredients, or features..."
              value={form.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="save-product-btn" disabled={loading}>
            <FaPlus /> {loading ? "Publishing Product..." : "Publish Product to Catalog"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminProductModal;
