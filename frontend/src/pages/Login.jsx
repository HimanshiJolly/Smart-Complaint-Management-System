
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {

  const [formData, setFormData] = useState({
    rollNumber: '',
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

      const response = await API.post('/auth/login/user', formData);

      login(response.data.user, response.data.token);

      navigate('/');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h2>Welcome Back</h2>

        <p className="login-subtitle">
          Login using your university roll number
        </p>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Roll Number</label>
            <input
              type="text"
              name="rollNumber"
              placeholder="22BCS123"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

        </form>

        <p className="register-link">
          New student? <Link to="/register">Create Account</Link>
        </p>

      </div>

    </div>
  );
};

export default Login;
