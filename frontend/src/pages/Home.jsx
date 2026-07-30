import { useEffect, useState, useRef } from "react";
import api from "../api/axios";

import "../styles/Home.css";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import PersonalizedFeed from "../components/PersonalizedFeed";
import FeaturedBanner from "../components/FeaturedBanner";
import StatsSection from "../components/StatsSection";
import CategorySection from "../components/CategorySection";
import TrendingProducts from "../components/TrendingProducts";
import SearchBar from "../components/SearchBar";
import FilterToolbar from "../components/FilterToolbar";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import BrandModal from "../components/BrandModal";
import CategoryModal from "../components/CategoryModal";
import AIChatbot from "../components/AIChatbot";
import Footer from "../components/Footer";

function Home() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Active filter state (brand/category/catalog filter)
  const [activeFilter, setActiveFilter] = useState({ type: "", value: "" });

  // Filter & Sort Toolbar State
  const [filterConfig, setFilterConfig] = useState({
    minRating: 0,
    minDiscount: 0,
    maxPrice: 10000,
    sortBy: "default",
  });

  // Modals State
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  // Cursor Spotlight
  const spotlightRef = useRef(null);

  useEffect(() => {
    const spotlight = spotlightRef.current;

    const moveSpotlight = (e) => {
      if (!spotlight) return;

      requestAnimationFrame(() => {
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;
      });
    };

    window.addEventListener("mousemove", moveSpotlight);

    return () => {
      window.removeEventListener("mousemove", moveSpotlight);
    };
  }, []);

  useEffect(() => {
    fetchTrendingProducts();
    fetchFullCatalogWithoutScroll();
  }, []);

  const fetchFullCatalogWithoutScroll = async () => {
    setLoading(true);
    setSearched(true);
    setActiveFilter({ type: "catalog", value: "Featured Product Catalog" });

    try {
      const response = await api.get("/search?query=a");

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Fetch Catalog Error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingProducts = async () => {
    try {
      const response = await api.get("/search?query=amazon");

      if (Array.isArray(response.data)) {
        setTrendingProducts(response.data);
      } else {
        setTrendingProducts([]);
      }
    } catch (error) {
      console.error("Trending Products Error:", error);
      setTrendingProducts([]);
    }
  };

  const fetchFullCatalog = async () => {
    setLoading(true);
    setSearched(true);
    setActiveFilter({ type: "catalog", value: "Full Product Catalog (28,977+ Items)" });

    try {
      const response = await api.get("/search?query=a");

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }

      scrollToResults();
    } catch (error) {
      console.error("Fetch Catalog Error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query) => {
    if (!query.trim()) {
      setProducts([]);
      setSearched(false);
      setActiveFilter({ type: "", value: "" });
      return;
    }

    setLoading(true);
    setSearched(true);
    setActiveFilter({ type: "search", value: query });

    try {
      const response = await api.get(
        `/search?query=${encodeURIComponent(query)}`
      );

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }

      scrollToResults();
    } catch (error) {
      console.error("Search Error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterByBrand = async (brandName) => {
    if (!brandName) return;

    setLoading(true);
    setSearched(true);
    setActiveFilter({ type: "brand", value: brandName });

    try {
      const response = await api.get(
        `/brand/${encodeURIComponent(brandName)}`
      );

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }

      scrollToResults();
    } catch (error) {
      console.error("Filter Brand Error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = async (categoryName) => {
    if (!categoryName) return;

    setLoading(true);
    setSearched(true);
    setActiveFilter({ type: "category", value: categoryName });

    try {
      const response = await api.get(
        `/category/${encodeURIComponent(categoryName)}`
      );

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }

      scrollToResults();
    } catch (error) {
      console.error("Filter Category Error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilter = () => {
    setProducts([]);
    setSearched(false);
    setActiveFilter({ type: "", value: "" });
  };

  const scrollToResults = () => {
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };

  // Compute Processed & Filtered Products
  const getProcessedProducts = () => {
    let list = [...products];

    // Filter by Rating
    if (filterConfig.minRating > 0) {
      list = list.filter((p) => Number(p.rating || 4.5) >= filterConfig.minRating);
    }

    // Filter by Discount
    if (filterConfig.minDiscount > 0) {
      list = list.filter((p) => Number(p.discount || 0) >= filterConfig.minDiscount);
    }

    // Filter by Max Price
    if (filterConfig.maxPrice > 0) {
      list = list.filter((p) => Number(p.price || 0) <= filterConfig.maxPrice);
    }

    // Sort By
    if (filterConfig.sortBy === "price-asc") {
      list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (filterConfig.sortBy === "price-desc") {
      list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (filterConfig.sortBy === "rating") {
      list.sort((a, b) => Number(b.rating || 4.5) - Number(a.rating || 4.5));
    } else if (filterConfig.sortBy === "discount") {
      list.sort((a, b) => Number(b.discount || 0) - Number(a.discount || 0));
    }

    return list;
  };

  const displayProducts = getProcessedProducts();

  return (
    <>
      <Navbar />

      {/* Premium Cursor Spotlight */}
      <div className="cursor-spotlight" ref={spotlightRef}></div>

      <Hero />

      {/* Personalized AI Recommended Feed */}
      <PersonalizedFeed />

      <FeaturedBanner />

      <StatsSection
        onSelectProducts={fetchFullCatalog}
        onOpenBrandModal={() => setBrandModalOpen(true)}
        onOpenCategoryModal={() => setCategoryModalOpen(true)}
      />

      <SearchBar onSearch={searchProducts} />

      <CategorySection onCategoryClick={filterByCategory} />

      <TrendingProducts products={trendingProducts} />

      <section id="results" className="trending-section">
        {loading && (
          <div className="trending-header">
            <h2>🤖 AI is Fetching Products...</h2>
            <p>Filtering items by {activeFilter.type || "query"}...</p>
          </div>
        )}

        {!loading && searched && (
          <div className="trending-header">
            {activeFilter.type === "catalog" && (
              <div className="active-filter-bar">
                <span>📦 Store Catalog: <strong>{activeFilter.value}</strong> ({displayProducts.length} Products Displayed)</span>
                <button className="clear-filter-btn" onClick={clearFilter}>
                  Clear Filter ✕
                </button>
              </div>
            )}

            {activeFilter.type === "brand" && (
              <div className="active-filter-bar">
                <span>🏷️ Brand Filter: <strong>{activeFilter.value}</strong> ({displayProducts.length} Products)</span>
                <button className="clear-filter-btn" onClick={clearFilter}>
                  Clear Filter ✕
                </button>
              </div>
            )}

            {activeFilter.type === "category" && (
              <div className="active-filter-bar">
                <span>🗂️ Category Filter: <strong>{activeFilter.value}</strong> ({displayProducts.length} Products)</span>
                <button className="clear-filter-btn" onClick={clearFilter}>
                  Clear Filter ✕
                </button>
              </div>
            )}

            {activeFilter.type === "search" && (
              <div className="active-filter-bar">
                <span>🔍 Search Query: <strong>{activeFilter.value}</strong> ({displayProducts.length} Products)</span>
                <button className="clear-filter-btn" onClick={clearFilter}>
                  Clear Filter ✕
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && searched && products.length > 0 && (
          <FilterToolbar
            onFilterChange={setFilterConfig}
            totalResults={displayProducts.length}
          />
        )}

        {!loading && searched && displayProducts.length === 0 && (
          <div className="empty-search">
            <h1>📦</h1>
            <h2>No Products Found</h2>
            <p>No products match the selected filters or query.</p>
          </div>
        )}

        <div className="products-grid">
          {loading
            ? [...Array(8)].map((_, index) => <SkeletonCard key={index} />)
            : displayProducts.map((product) => (
                <ProductCard key={product.asin} product={product} />
              ))}
        </div>
      </section>

      {/* Interactive Brand Explorer Modal */}
      <BrandModal
        isOpen={brandModalOpen}
        onClose={() => setBrandModalOpen(false)}
        onSelectBrand={filterByBrand}
      />

      {/* Interactive Category Explorer Modal */}
      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSelectCategory={filterByCategory}
      />

      {/* Floating AI Shopping Assistant */}
      <AIChatbot />

      <Footer />
    </>
  );
}

export default Home;