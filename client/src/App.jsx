import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './features/auth/authSlice';
import Loader from './components/Loader';

// Protected Route Component
const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    // Redirect to register if not logged in
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  if (isAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected User Routes */}
          <Route path="/browse" element={
            <ProtectedRoute>
              <BrowsePage />
            </ProtectedRoute>
          } />
          <Route path="/notes/:noteId" element={
            <ProtectedRoute>
              <NoteDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute isAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/pending" element={
            <ProtectedRoute isAdmin={true}>
              <AdminPendingNotes />
            </ProtectedRoute>
          } />
          <Route path="/admin/all" element={
            <ProtectedRoute isAdmin={true}>
              <AdminAllNotes />
            </ProtectedRoute>
          } />
          <Route path="/admin/saved" element={
            <ProtectedRoute isAdmin={true}>
              <AdminSavedNotes />
            </ProtectedRoute>
          } />
          <Route path="/admin/subjects" element={
            <ProtectedRoute isAdmin={true}>
              <SubjectManager />
            </ProtectedRoute>
          } />
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