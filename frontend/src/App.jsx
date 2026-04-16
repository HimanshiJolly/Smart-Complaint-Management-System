import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// We will create these components in the next step
const Home = () => <h2>Home / Dashboard Page Placeholder</h2>;
const Login = () => <h2>Login Page Placeholder</h2>;
const Register = () => <h2>Register Page Placeholder</h2>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;