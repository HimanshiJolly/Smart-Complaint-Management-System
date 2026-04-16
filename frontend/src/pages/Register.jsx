import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', formData);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required style={{ padding: '8px' }}/>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={{ padding: '8px' }}/>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={{ padding: '8px' }}/>
        <select name="role" onChange={handleChange} style={{ padding: '8px' }}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={{ padding: '10px', cursor: 'pointer', background: '#333', color: 'white', border: 'none' }}>Register</button>
      </form>
      <p style={{ marginTop: '10px' }}>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default Register;