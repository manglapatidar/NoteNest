import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './features/auth/authSlice';
import Loader from './components/Loader';

function PageTransition({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (loading) return <Loader fullScreen={true} text="Loading NoteNest..." />;
  return children;
}

import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import BrowsePage from './pages/BrowsePage';
import NoteDetailPage from './pages/NoteDetailPage';
import UploadPage from './pages/UploadPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import SubjectManager from './pages/admin/SubjectManager';
import AdminPendingNotes from './pages/admin/AdminPendingNotes';
import AdminAllNotes from './pages/admin/AdminAllNotes';
import AdminSavedNotes from './pages/admin/AdminSavedNotes';

function AppContent() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const currentUser = user;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="w-full min-h-screen bg-[#08090A] text-[#A1A1AA] font-body selection:bg-[#00C896]/30 selection:text-[#F5F5F5] overflow-x-hidden">
      <Navbar
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <PageTransition>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/notes/:noteId" element={<NoteDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={currentUser?.role === 'admin' ? <AdminDashboard /> : <LandingPage />} />
          <Route path="/admin/pending" element={currentUser?.role === 'admin' ? <AdminPendingNotes /> : <LandingPage />} />
          <Route path="/admin/all" element={currentUser?.role === 'admin' ? <AdminAllNotes /> : <LandingPage />} />
          <Route path="/admin/saved" element={currentUser?.role === 'admin' ? <AdminSavedNotes /> : <LandingPage />} />
          <Route path="/admin/subjects" element={currentUser?.role === 'admin' ? <SubjectManager /> : <LandingPage />} />
        </Routes>
      </PageTransition>

      <ToastContainer position="top-center" autoClose={3000} theme="dark" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;