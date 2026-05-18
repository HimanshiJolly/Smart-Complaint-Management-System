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

      {/* LEFT */}
      <div className="nav-logo">

        <Link to="/" className="logo-link">

          <img
            src="/favicon.png"
            alt="Resolvio Logo"
            className="logo-image"
          />

          <div>
            <h2>Resolvio</h2>
            <p>Smart Complaint Management</p>
          </div>

        </Link>

      </div>

      {/* RIGHT */}
      <div className="nav-links">

        {user ? (
          <>
            <div className="user-badge">
              👋 Hi, {user.name}
              <span>{user.role}</span>
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