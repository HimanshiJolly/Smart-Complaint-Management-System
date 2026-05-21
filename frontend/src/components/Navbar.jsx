import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {

  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (

    <nav className="navbar">

      {/* LOGO SECTION */}
      <div className="nav-left">

        <Link to="/" className="logo-link">

          <div className="logo-wrapper">
            <img
              src="/favicon.png"
              alt="Resolvio Logo"
              className="logo-image"
            />
          </div>

          <div className="logo-text">
            <h2>Resolvio</h2>
            <p>Smart Complaint Management</p>
          </div>

        </Link>

      </div>

      {/* CENTER MENU */}
      <div className="nav-center">

        <Link to="/" className="nav-menu-link">
          Home
        </Link>

       <button
  className="nav-menu-link nav-btn-link"
  onClick={() => {
    const section = document.getElementById("about-section");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  }}
>
  About Us
</button>

        <button
  className="nav-menu-link nav-btn-link"
  onClick={() => {
    const section = document.getElementById("features-section");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  }}
>
  Features
</button>

   <button
  className="admin-panel-btn"
  onClick={() => window.location.href = "http://localhost:5174/login"}
>
  Admin Panel
</button>

      </div>

      {/* RIGHT SECTION */}
      <div className="nav-right">

        {user ? (
          <>
            <div className="user-badge">

              <div className="user-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div className="user-info">
                <h4>{user.name}</h4>
                <span>{user.role}</span>
              </div>

            </div>

            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-link">
              Login
            </Link>

            <Link to="/register" className="register-btn">
              Register
            </Link>
          </>
        )}

      </div>

    </nav>
  );
};

export default Navbar;