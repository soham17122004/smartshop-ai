import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import {
  FaRobot,
  FaEnvelope,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";

import "../styles/Auth.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/login", {
        email: form.email,
        password: form.password,
      });

      login(response.data);

      toast.success("Login Successful");

      if (
        response.data?.user?.role === "admin" ||
        response.data?.user?.email === "dobariyasoham@gmail.com"
      ) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header-logo">
          <FaRobot />
          <h2>SmartShop AI</h2>
          <span>ML Recommendation Platform</span>
        </div>

        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to access your account</p>

        <form className="auth-form" onSubmit={loginUser}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-box">
              <FaEnvelope />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-box">
              <FaLock />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing In..." : "Login"} <FaArrowRight />
          </button>

          <div className="auth-footer">
            <span>Don't have an account?</span>
            <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;