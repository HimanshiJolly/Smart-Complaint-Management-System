// frontend/src/components/Navbar.jsx

import { useContext } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { AuthContext }
from "../context/AuthContext";

import "./Navbar.css";

const Navbar = () => {

  const {
    user,
    logout,
  } = useContext(AuthContext);

  const navigate =
    useNavigate();

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    logout();

    navigate("/");

  };

  // =========================
  // PROFILE CLICK
  // =========================

  const handleProfileClick = () => {

    navigate("/profile");

  };

  return (

    <nav className="navbar">

      {/* ========================= */}
      {/* LEFT */}
      {/* ========================= */}

      <div className="nav-left">

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

      {/* ========================= */}
      {/* CENTER */}
      {/* ========================= */}

     <div className="nav-center">

  {/* HOME ALWAYS VISIBLE */}
  <Link to="/" className="nav-menu-link">
    Home
  </Link>

  {/* ONLY FOR GUEST USERS */}
  {!user && (
    <>
      <button
        className="nav-menu-link nav-btn-link"
        onClick={() => {
          const section = document.getElementById("about-section");
          section?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        About Us
      </button>

      <button
        className="nav-menu-link nav-btn-link"
        onClick={() => {
          const section = document.getElementById("features-section");
          section?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        Features
      </button>

      <button
        className="admin-panel-btn"
        onClick={() =>
          (window.location.href = "http://localhost:5173/login")
        }
      >
        Admin Panel
      </button>
    </>
  )}

</div>

      {/* ========================= */}
      {/* RIGHT */}
      {/* ========================= */}

      <div className="nav-right">

        {user ? (

          <>

            {/* PROFILE SECTION */}

            <div
              className="user-badge"
              onClick={
                handleProfileClick
              }
            >

             

              {/* USER INFO */}

              <div className="user-info">

                <h4>
                  {user.fullName}
                </h4>

                <span>
                  {user.role}
                </span>

              </div>

            </div>

            {/* LOGOUT */}

            <button
              onClick={
                handleLogout
              }
              className="logout-btn"
            >

              Logout

            </button>

          </>

        ) : (

          <>

            <Link
              to="/login"
              className="login-link"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="register-btn"
            >
              Register
            </Link>

          </>

        )}

      </div>

    </nav>
  );
};

export default Navbar;