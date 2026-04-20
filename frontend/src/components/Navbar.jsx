import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css'; 

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <h2>
          <Link to="/">Resolvio-Smart Complaint Management</Link>
        </h2>
      </div>

      <div className="nav-links">
        {user ? (
          <>
            <span className="user-greeting">
              Hi, {user.name} ({user.role})
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" style={{ 
              background: 'var(--accent)', 
              color: 'black', 
              padding: '8px 16px', 
              borderRadius: '10px' 
            }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;