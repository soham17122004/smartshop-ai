import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "../styles/SimilarProducts.css";

function SimilarProducts({ asin }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("===== SimilarProducts Mounted =====");
  console.log("ASIN:", asin);

  useEffect(() => {
    if (!asin) {
      console.log("ASIN is empty");
      setLoading(false);
      return;
    }

    fetchRecommendations();
  }, [asin]);

  const fetchRecommendations = async () => {
    try {
      console.log("Calling Recommendation API...");

      const response = await axios.get(
        `http://127.0.0.1:8000/recommend/${asin}`
      );

      console.log("API Response:", response.data);

      setProducts(response.data);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        marginTop: "60px",
        border: "5px solid red",
        padding: "20px",
        background: "#fff",
      }}
    >
      <h1 style={{ color: "red" }}>
        Similar Products Component Loaded
      </h1>

      <p>ASIN : {asin}</p>

      <p>Products : {products.length}</p>

      {loading && <h2>Loading...</h2>}

      <div className="similar-grid">
        {products.map((product) => (
          <ProductCard
            key={product.asin}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}

export default SimilarProducts;