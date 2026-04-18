import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

export default function Navbar({ isLoggedIn, currentUser, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    toast.success('Logged out successfully');
    setMobileOpen(false);
  };

  const navLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `text-sm font-medium px-3 py-1.5 transition-colors duration-200 relative after:block after:h-px after:bg-[#00C896] after:transition-all after:duration-300 hover:after:w-full ${
      isActive ? 'text-[#F5F5F5] after:w-full' : 'text-[#A1A1AA] hover:text-[#F5F5F5] after:w-0'
    }`;
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const closeMenu = () => setMobileOpen(false);
  const userInitial = currentUser?.name?.[0]?.toUpperCase() || 'U';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#08090A]/80 backdrop-blur-xl border-b border-[#1F2023] animate-fade-down">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-full">

        {/* LEFT */}
        <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
          <div className="w-8 h-8 bg-[#00C896] rounded-lg flex items-center justify-center text-[#08090A] font-bold text-sm">
            N
          </div>
          <span className="text-lg font-bold text-[#F5F5F5]">NoteNest</span>
        </Link>

        {/* CENTER */}
        <div className="hidden md:flex items-center gap-2">
          {!isLoggedIn ? (
            <>
              <a href="/#features" className={navLinkClass('#features')}>Features</a>
              <a href="/#how-it-works" className={navLinkClass('#how-it-works')}>How it Works</a>
            </>
          ) : (
            <>
              <Link to="/browse" className={navLinkClass('/browse')}>Browse</Link>

              {currentUser?.role !== 'admin' && (
                <Link to="/upload" className={navLinkClass('/upload')}>Upload</Link>
              )}

              {currentUser?.role === 'admin' && (
                <>
                  <Link to="/admin" className={navLinkClass('/admin')}>Dashboard</Link>
                  <Link to="/admin/subjects" className={navLinkClass('/admin/subjects')}>Subjects</Link>
                </>
              )}
            </>
          )}
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoggedIn && !isAuthPage ? (
            <>
              <button onClick={() => navigate('/login')} className="text-sm">Login</button>
              <button onClick={() => navigate('/register')} className="bg-[#00C896] hover:bg-[#00E5B0] text-[#08090A] font-bold px-5 py-2 rounded-xl text-sm hover:scale-105 hover:shadow-[0_0_15px_rgba(0,200,150,0.4)] transition-all duration-200">Get Started</button>
            </>
          ) : isLoggedIn ? (
            <div className="flex items-center gap-3">

              {/* Profile hidden for admin */}
              {currentUser?.role !== "admin" && (
                <Link
                  to="/profile"
                  className="w-8 h-8 rounded-full bg-[#00C896]/10 border border-[#00C896]/30 text-[#00C896] text-xs font-bold flex items-center justify-center"
                >
                  {userInitial}
                </Link>
              )}

              <button onClick={handleLogout} className="text-xs text-[#52525B]">
                Logout
              </button>
            </div>
          ) : null}
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="absolute top-16 left-0 right-0 bg-[#0F1012] px-6 py-4 flex flex-col gap-4 md:hidden">
            
            <Link to="/browse" onClick={closeMenu}>Browse</Link>

            {currentUser?.role !== 'admin' && (
              <Link to="/upload" onClick={closeMenu}>Upload</Link>
            )}

            {currentUser?.role === 'admin' && (
              <>
                <Link to="/admin" onClick={closeMenu}>Dashboard</Link>
                <Link to="/admin/subjects" onClick={closeMenu}>Subjects</Link>
              </>
            )}

            {/* ❌ Profile hidden for admin */}
            {currentUser?.role !== "admin" && (
              <Link to="/profile" onClick={closeMenu}>Profile</Link>
            )}

            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}