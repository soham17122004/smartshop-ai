import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaLock, FaHome, FaShieldAlt } from "react-icons/fa";
import "../styles/AdminRoute.css";

function AdminRoute({ children }) {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin =
    user &&
    (user.role === "admin" ||
      user.email === "dobariyasoham@gmail.com" ||
      user.email === "admin@smartshop.com" ||
      user.email?.toLowerCase().includes("admin"));

  if (!isAdmin) {
    return (
      <div className="access-denied-page">
        <div className="access-denied-card">
          <div className="shield-icon">
            <FaShieldAlt />
          </div>
          <h2>Access Denied</h2>
          <span className="denied-badge">
            <FaLock /> Admin Authorization Required
          </span>
          <p>
            The Admin Panel is restricted to authorized store administrators only.
            Your account (<strong>{user?.email}</strong>) does not have admin permissions.
          </p>

          <Link to="/" className="back-home-btn">
            <FaHome /> Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return children;
}

export default AdminRoute;
