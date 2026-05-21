import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import axios from "axios";

import "./AdminLogin.css";

const AdminLogin = () => {

  const [formData, setFormData] = useState({
    adminId: "",
    password: "",
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const API_URL =
    "http://localhost:5000/api";

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        `${API_URL}/auth/login/admin`,
        formData
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "admin",
        JSON.stringify(response.data.user)
      );

      navigate("/");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Invalid Admin Credentials"
      );

    }
  };

  return (
  <>
    {/* NAVBAR */}
    <nav className="admin-navbar">

      <div className="admin-logo">
         <Link
          to="/"
          className="logo-link"
        >

          <div className="logo-wrapper">

            <img
              src="/favicon.png"
              alt="Resolvio Logo"
              className="logo-image"
            />

          </div>

          <div className="logo-text">

            <h2>
              Resolvio
            </h2>

            <p>
              Smart Complaint Management
            </p>

          </div>

        </Link>
      </div>

      <button
        className="home-btn"
        onClick={() =>
          (window.location.href = "http://localhost:5174/")
        }
      >
        ⬅ Home
      </button>

    </nav>

    {/* LOGIN CARD */}
    <div className="login-container">

      <div className="login-card">

        <h2>Admin Login</h2>

        <p className="login-subtitle">
          Login to manage complaints
        </p>

        {error && (
          <p className="error-msg">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >

          <div className="input-group">
            <label>Admin ID</label>
            <input
              type="text"
              name="adminId"
              placeholder="ADM101"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
          >
            Sign In
          </button>

        </form>

      </div>

    </div>
  </>
);
};

export default AdminLogin;