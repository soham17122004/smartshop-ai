import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaShoppingCart,
  FaHome,
  FaRobot,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaChartPie,
  FaSun,
  FaMoon,
  FaBoxOpen,
} from "react-icons/fa";


import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useCurrency } from "../context/CurrencyContext";
import "../styles/Navbar.css";

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currency, changeCurrency } = useCurrency();
  const navigate = useNavigate();

  const loadCounts = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const totalCart = cart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );

    setCartCount(totalCart);
    setWishlistCount(wishlist.length);
  };

  useEffect(() => {
    loadCounts();

    window.addEventListener("storage", loadCounts);
    window.addEventListener("cartUpdated", loadCounts);
    window.addEventListener("wishlistUpdated", loadCounts);

    return () => {
      window.removeEventListener("storage", loadCounts);
      window.removeEventListener("cartUpdated", loadCounts);
      window.removeEventListener("wishlistUpdated", loadCounts);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <div className="logo-icon">
            <FaRobot />
          </div>

          <div className="logo-text">
            <h2>SmartShop AI</h2>
            <span>AI Recommendation System</span>
          </div>
        </Link>

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <NavLink to="/" onClick={closeMenu}>
              <FaHome />
              <span>Home</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/wishlist" onClick={closeMenu}>
              <div className="nav-icon">
                <FaHeart />
                {wishlistCount > 0 && (
                  <span className="badge">{wishlistCount}</span>
                )}
              </div>
              <span>Wishlist</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/cart" onClick={closeMenu}>
              <div className="nav-icon">
                <FaShoppingCart />
                {cartCount > 0 && (
                  <span className="badge">{cartCount}</span>
                )}
              </div>
              <span>Cart</span>
            </NavLink>
          </li>

          {isLoggedIn && (
            <li>
              <NavLink to="/my-orders" onClick={closeMenu}>
                <FaBoxOpen />
                <span>My Orders</span>
              </NavLink>
            </li>
          )}

          {isAdmin && (
            <li>
              <NavLink to="/admin" onClick={closeMenu} className="admin-nav-link">
                <FaChartPie />
                <span>Admin ⚡</span>
              </NavLink>
            </li>
          )}



          {/* Theme Toggle Button */}
          <li>
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>
          </li>

          {isLoggedIn ? (
            <>
              <li className="user-name">
                <FaUser />
                <span>{user?.full_name}</span>
              </li>

              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" onClick={closeMenu}>
                  <FaSignInAlt />
                  <span>Login</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/register" onClick={closeMenu}>
                  <FaUserPlus />
                  <span>Register</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;