import { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar, FaUserCircle, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import "../styles/ProductReviews.css";

function ProductReviews({ asin }) {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Rohan Verma",
      rating: 5,
      date: "2 days ago",
      comment: "Excellent product! Reached in perfect condition and AI recommendations suggested exactly what I needed.",
    },
    {
      id: 2,
      name: "Sneha Patel",
      rating: 4,
      date: "1 week ago",
      comment: "Great quality for the price. Delivery was super fast within 24 hours.",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) {
      toast.warning("Please enter your name and review comment.");
      return;
    }

    const newReview = {
      id: Date.now(),
      name: form.name,
      rating: Number(form.rating),
      date: "Just now",
      comment: form.comment,
    };

    setReviews([newReview, ...reviews]);
    setForm({ name: "", rating: 5, comment: "" });
    toast.success("⭐ Review submitted successfully!");
  };

  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h3>Customer Reviews & Ratings</h3>
        <div className="overall-score">
          <span className="big-rating">{avgRating}</span>
          <div>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.round(avgRating) ? "active-star" : "dim-star"} />
              ))}
            </div>
            <span className="count">{reviews.length} Verified Reviews</span>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <form className="add-review-form" onSubmit={handleSubmit}>
        <h4>Write a Customer Review</h4>
        <div className="form-row">
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <select
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          >
            <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
            <option value={4}>⭐⭐⭐⭐ (4 Stars - Good)</option>
            <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
            <option value={2}>⭐⭐ (2 Stars - Fair)</option>
            <option value={1}>⭐ (1 Star - Poor)</option>
          </select>
        </div>

        <textarea
          rows="3"
          placeholder="Share details of your experience with this product..."
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          required
        ></textarea>

        <button type="submit" className="submit-review-btn">
          Submit Review <FaPaperPlane />
        </button>
      </form>

      {/* Reviews Feed */}
      <div className="reviews-feed">
        {reviews.map((rev) => (
          <div key={rev.id} className="review-card">
            <div className="review-user-row">
              <div className="user-info">
                <FaUserCircle className="user-icon" />
                <div>
                  <h5>{rev.name}</h5>
                  <span className="date">{rev.date}</span>
                </div>
              </div>

              <div className="user-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < rev.rating ? "active-star" : "dim-star"} />
                ))}
              </div>
            </div>

            <p className="comment">{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductReviews;
