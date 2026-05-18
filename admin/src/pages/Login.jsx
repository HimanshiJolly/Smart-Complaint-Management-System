import { useState, useContext } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import API from '../services/api';

import { AuthContext } from '../context/AuthContext';

import './Login.css';

const AdminLogin = () => {

  const [formData, setFormData] = useState({

    adminId: '',
    password: ''

  });

  const [error, setError] = useState('');

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await API.post(
        '/auth/admin-login',
        formData
      );

      login(
        response.data.user,
        response.data.token
      );

      navigate('/');

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Invalid Admin Credentials'
      );
    }
  };

  return (

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

        <p className="register-link">

          Need admin access?

          <Link to="/admin-register">
            Register here
          </Link>

        </p>

      </div>

    </div>
  );
};

export default AdminLogin;