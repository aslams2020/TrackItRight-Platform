import { Link, useNavigate } from "react-router-dom";
import { isAuthed, getRole } from "../utils/auth.js";
import { useState, useEffect } from "react";

import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const authed = isAuthed();
  const role = getRole();

  const handleStart = () => {
    if (!authed) {
      navigate("/login");
    } else {
      if (role === "USER") navigate("/citizen");
      else if (role === "AUTHORITY") navigate("/authority");
      else navigate("/admin");
    }
  };

  useEffect(() => {
  const animateCounter = (id, end, duration) => {
    let start = 0;
    const obj = document.getElementById(id);
    if (!obj) return;
    const stepTime = Math.floor(duration / end);

    const counter = setInterval(() => {
      start++;
      obj.innerText = start + "+"; // Add + at the end
      if (start >= end) {
        clearInterval(counter);
      }
    }, stepTime);
  };

  animateCounter("complaints-count", 150, 2000); 
  animateCounter("users-count", 30, 2000);       
  animateCounter("modules-count", 8, 2000);     
}, []);


  return (
    <div className="home-container fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          Welcome to <span>TrackItRight</span>
        </h1>
        <p className="hero-subtitle">
          Automated, Paperless, and Transparent Complaint System
        </p>
        <div className="hero-buttons">
          <button className="btn primary-btn" onClick={handleStart}>
            Register a Complaint
          </button>
          <Link to="/register" className="btn secondary-btn">
            Register
          </Link>
          <Link to="/login" className="btn secondary-btn">
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="info-section">
        <h2>Why TrackItRight?</h2>
        <div className="steps-container">
          <div className="step-card">
            <span className="step-number">1</span>
            <h3>Transparency</h3>
            <p>Follow every step of your complaint with real-time status.</p>
          </div>
          <div className="step-card">
            <span className="step-number">2</span>
            <h3>Accountability</h3>
            <p>Departments and authorities are assigned and tracked.</p>
          </div>
          <div className="step-card">
            <span className="step-number">3</span>
            <h3>Feedback</h3>
            <p>Rate resolutions and improve service quality continuously.</p>
          </div>
        </div>
      </section>

      {/* Stats / Impact Section */}
      <section className="stats-section">
        <h2>Our Impact</h2>
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-number" id="complaints-count">0</span>
            <p>Complaints Tracked</p>
          </div>
          <div className="stat-card">
            <span className="stat-number" id="users-count">0</span>
            <p>Active Users</p>
          </div>
          <div className="stat-card">
            <span className="stat-number" id="modules-count">0</span>
            <p>Modules Implemented</p>
          </div>
        </div>
      </section>


      {/* How It Works - Timeline Style */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="timeline-container">
          <div className="timeline-step">
            <div className="step-number">1</div>
            <div className="step-text">
              <h3>Login / Register</h3>
              <p>Create your account or log in to start reporting issues.</p>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-number">2</div>
            <div className="step-text">
              <h3>Submit</h3>
              <p>Select department, describe the issue, and submit a complaint.</p>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-number">3</div>
            <div className="step-text">
              <h3>Track</h3>
              <p>Get real-time updates from your dashboard until resolved.</p>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-number">4</div>
            <div className="step-text">
              <h3>Feedback</h3>
              <p>Once resolved, provide feedback and close the complaint.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
