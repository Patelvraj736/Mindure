import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/auth";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/login", {
        username,
        password,
      });
      setToken(res.data.access_token);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-intro">
        <h1 className="app-title">🧠 Mindure</h1>
        <p className="app-description">
          Welcome back 👋 <br />
          Track your feelings and boost your well-being 💙
        </p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>🔐 Login</h2>
        <input
          type="text"
          placeholder="👤 Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="🔑 Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">🚀 Login</button>
        <p className="footer-text">
          Don’t have an account? <span onClick={() => navigate("/register")}>Register here</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
