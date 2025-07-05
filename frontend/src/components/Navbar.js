import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, removeToken } from "../utils/auth";
import "./Navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const prevScrollY = useRef(window.scrollY);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    removeToken();
    setMenuOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > prevScrollY.current && currentScrollY > 60) {
        setShowNavbar(false); 
      } else {
        setShowNavbar(true); 
      }
      prevScrollY.current = currentScrollY;
    };

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`navbar ${showNavbar ? "navbar-visible" : "navbar-hidden"}`}
      ref={menuRef}
    >
      <div className="navbar-brand" onClick={() => { navigate("/"); setMenuOpen(false); }}>
        <img src={logo} alt="Mindure Logo" className="navbar-logo" />
        <span className="navbar-title">Mindure</span>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <div className={menuOpen ? "bar bar1 active" : "bar bar1"} />
        <div className={menuOpen ? "bar bar2 active" : "bar bar2"} />
        <div className={menuOpen ? "bar bar3 active" : "bar bar3"} />
      </div>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        {isLoggedIn() ? (
          <>
            <Link to="/detect" onClick={() => setMenuOpen(false)}>Detect</Link>
            <Link to="/history" onClick={() => setMenuOpen(false)}>History</Link>
            <Link to="/calendar" onClick={() => setMenuOpen(false)}>Calendar</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
