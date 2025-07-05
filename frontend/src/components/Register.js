import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; 

const Register = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://localhost:8000/register", form);
      navigate("/login"); 
    } catch (err) {
      if (
        err.response &&
        (err.response.status === 400 || err.response.status === 409)
      ) {
        setError("🚫 User already registered. Please log in.");
      } else {
        setError("❌ Registration failed. Try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">📝 Create Your Account</h1>
      <p className="login-subtitle">
        Join Mindure and begin your journey of emotional awareness.
      </p>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p style={{ color: "#ff4d4f", textAlign: "center" }}>{error}</p>}
        <input
          placeholder="👤 Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="🔑 Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Register</button>
      </form>

      <p className="footer-text">
        Already have an account?{" "}
        <span onClick={() => navigate("/login")}>Login here</span>
      </p>
    </div>
  );
};

export default Register;
