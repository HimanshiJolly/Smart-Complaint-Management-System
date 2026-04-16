import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/login', formData);
      login(response.data.user, response.data.token); // Save user to context & local storage
      navigate('/'); // Redirect to Home/Dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={{ padding: '8px' }}/>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={{ padding: '8px' }}/>
        <button type="submit" style={{ padding: '10px', cursor: 'pointer', background: '#333', color: 'white', border: 'none' }}>Login</button>
      </form>
      <p style={{ marginTop: '10px' }}>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
};

export default Login;