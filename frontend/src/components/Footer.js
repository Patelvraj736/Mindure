import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <p>🌐 Made with ❤️ by Mindure Team</p>
      <div className="footer-links">
        <a href="/">Home</a>
        <a href="/">About</a>
        <a href="/">Privacy</a>
      </div>
      <p className="footer-copy">&copy; {new Date().getFullYear()} Mindure. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
