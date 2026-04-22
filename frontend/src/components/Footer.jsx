import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* LEFT */}
        <div className="footer-brand">
          <h2>Resolvio</h2>
          <p>Smart complaint system for college students.</p>
        </div>

        {/* CENTER */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
          </ul>
        </div>

        {/* RIGHT */}
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>Email: resolvio@gmail.com</p>
          <p>Campus Help Desk:-#012,Turing block, Campus</p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Resolvio. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;