import { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import API from '../services/api';

import './Register.css';

const AdminRegister = () => {

  const [formData, setFormData] = useState({

    name: '',
    email: '',
    phone: '',
    adminId: '',
    password: '',
    role: 'admin'

  });

  const [error, setError] = useState('');

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

      await API.post(
        '/auth/register/admin',
        formData
      );

      alert('Admin Registered Successfully');

      navigate('/admin-login');

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Registration failed'
      );
    }
  };

  return (

    <div className="register-container">

      <div className="register-card">

        <h2>Admin Registration</h2>

        <p className="register-subtitle">
          Create administrator account
        </p>

        {error && (
          <p className="error-msg">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="register-form"
        >

          <div className="input-group">

            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="admin@university.edu"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">

            <label>Phone Number</label>

            <input
              type="tel"
              name="phone"
              placeholder="9876543210"
              onChange={handleChange}
              required
            />
          </div>

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

          <div className="input-group full-width">

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
            className="register-button"
          >
            Create Admin Account
          </button>

        </form>

        <p className="login-link">

          Already registered?

          <Link to="/admin-login">
            Login here
          </Link>

        </p>

      </div>

    </div>
  );
};

export default AdminRegister;