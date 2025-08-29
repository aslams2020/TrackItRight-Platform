import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Home from "./pages/Home.jsx";
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CitizenDashboard from './pages/CitizenDashboard.jsx';
import AuthorityDashboard from './pages/AuthorityDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ProtectedRoute from './router/ProtectedRoute.jsx';
import Footer from "./components/Footer.jsx";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

export default function App() {

  useEffect(() => {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const update = () => {
    const doc = document.documentElement;
    const y = document.body.scrollTop || doc.scrollTop;
    const h = doc.scrollHeight - doc.clientHeight;
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
  return () => {
    window.removeEventListener('scroll', update);
    window.removeEventListener('resize', update);
  };
}, []);


  return (
    <>
      <Navbar />
      <div id="scroll-progress"></div>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/citizen"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/authority"
            element={
              <ProtectedRoute allowedRoles={['AUTHORITY']}>
                <AuthorityDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
