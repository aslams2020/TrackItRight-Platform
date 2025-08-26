import { Link, useNavigate } from 'react-router-dom';
import { isAuthed, getRole } from '../utils/auth.js';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const authed = isAuthed();
  const role = getRole();

  const handleStart = () => {
    if (!authed) {
      navigate('/login');
    } else {
      if (role === 'USER') navigate('/citizen');
      else if (role === 'AUTHORITY') navigate('/authority');
      else navigate('/admin');
    }
  };

  return (
    <div className="landing">
      <section className="hero">
        <h1>TrackItRight</h1>
        <p className="subtitle">Automated, Paperless, and Transparent Complaint System</p>
        <div className="cta">
          <button className="btn" onClick={handleStart}>Register a Complaint</button>
          <Link to="/login" className="btn-outline">Login</Link>
          <Link to="/register" className="btn-outline">Register</Link>
        </div>
      </section>

      <section className="features">
        <h2>Why TrackItRight?</h2>
        <div className="grid">
          <div className="card">
            <h3>Transparency</h3>
            <p>Follow every step of your complaint with real-time status.</p>
          </div>
          <div className="card">
            <h3>Accountability</h3>
            <p>Departments and authorities are assigned and tracked.</p>
          </div>
          <div className="card">
            <h3>Feedback</h3>
            <p>Rate resolutions and improve service quality continuously.</p>
          </div>
        </div>
      </section>

      <section className="steps">
        <h2>How it works</h2>
        <ol>
          <li>Login or create an account.</li>
          <li>Submit your complaint with department selection.</li>
          <li>Track progress in your dashboard.</li>
          <li>When resolved, give feedback.</li>
        </ol>
      </section>
    </div>
  );
}
