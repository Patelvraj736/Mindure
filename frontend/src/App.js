import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import EmotionDetector from "./components/EmotionDetector";
import Login from "./components/Login";
import Register from "./components/Register";
import History from "./components/History";
import MoodCalendar from "./components/MoodCalendar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/detect" element={<EmotionDetector />} />
        <Route path="/history" element={<History />} />
        <Route path="/calendar" element={<MoodCalendar />} />
      </Routes>
       <Footer />
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
  
);

export default AppWrapper;
