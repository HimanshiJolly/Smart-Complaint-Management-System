import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from "./pages/Profile";

import Footer from './components/Footer';
import './main.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="main-layout">
          <Navbar />
          <main style={{ padding: '0 0px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />}/>
            </Routes>

          </main>
          <Footer/>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;