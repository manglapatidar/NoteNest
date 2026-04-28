import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { Menu, X, LogOut, User, LayoutDashboard, BookOpen, Upload, Home, ChevronRight } from 'lucide-react';

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
    return `text-sm font-bold px-4 py-2 transition-all duration-300 relative group flex items-center gap-1 ${
      isActive ? 'text-[#00C896]' : 'text-[#A1A1AA] hover:text-[#F5F5F5]'
    }`;
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const closeMenu = () => setMobileOpen(false);
  const userInitial = currentUser?.name?.[0]?.toUpperCase() || 'U';

  const handleProtectedClick = (e, path) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.info("Please register or login to access this feature");
      navigate('/register');
      closeMenu();
    } else {
      closeMenu();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-16 bg-[#08090A] border-b border-[#1F2023] animate-fade-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-full">

        {/* LEFT */}
        <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
          <div className="w-8 h-8 bg-[#00C896] rounded-lg flex items-center justify-center text-[#08090A] font-bold text-sm shadow-[0_0_15px_rgba(0,200,150,0.3)]">
            N
          </div>
          <span className="text-lg font-bold text-[#F5F5F5] tracking-tight">NoteNest</span>
        </Link>

        {/* CENTER - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {!isLoggedIn ? (
            <>
              <a href="/#features" className={navLinkClass('#features')}>Features</a>
              <a href="/#how-it-works" className={navLinkClass('#how-it-works')}>How it Works</a>
              <Link to="/browse" onClick={(e) => handleProtectedClick(e, '/browse')} className={navLinkClass('/browse')}>Browse</Link>
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

        {/* RIGHT - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoggedIn && !isAuthPage ? (
            <>
              <button onClick={() => navigate('/login')} className="text-sm font-medium text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors">Login</button>
              <button onClick={() => navigate('/register')} className="bg-[#00C896] hover:bg-[#00E5B0] text-[#08090A] font-bold px-5 py-2 rounded-xl text-sm hover:scale-105 hover:shadow-[0_0_15px_rgba(0,200,150,0.4)] transition-all duration-200">Get Started</button>
            </>
          ) : isLoggedIn ? (
            <div className="flex items-center gap-4">
              {currentUser?.role !== "admin" && (
                <Link
                  to="/profile"
                  className="w-9 h-9 rounded-full bg-[#00C896]/10 border border-[#00C896]/30 text-[#00C896] text-sm font-bold flex items-center justify-center hover:bg-[#00C896]/20 transition-all"
                >
                  {userInitial}
                </Link>
              )}

              <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs font-medium text-[#52525B] hover:text-[#EF4444] transition-colors">
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : null}
        </div>

        {/* MOBILE TOGGLE */}
        <div className="md:hidden flex items-center gap-3">
          {isLoggedIn && currentUser?.role !== "admin" && (
            <Link to="/profile" className="w-8 h-8 rounded-full bg-[#00C896]/10 border border-[#00C896]/30 text-[#00C896] text-xs font-bold flex items-center justify-center">
              {userInitial}
            </Link>
          )}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div className={`
          fixed inset-0 top-0 h-screen bg-[#08090A] z-[150] md:hidden 
          transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${mobileOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'}
        `}>
          {/* Header in mobile menu */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-[#1F2023]">
            <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
              <div className="w-8 h-8 bg-[#00C896] rounded-lg flex items-center justify-center text-[#08090A] font-bold text-sm">N</div>
              <span className="text-lg font-bold text-[#F5F5F5]">NoteNest</span>
            </Link>
            <button onClick={closeMenu} className="p-2 text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors">
              <X size={28} />
            </button>
          </div>

          <div className="flex flex-col h-[calc(100vh-64px)] p-8">
            <div className="flex flex-col gap-2">
              <div className="text-[10px] font-bold text-[#52525B] uppercase tracking-[0.25em] mb-4">Navigation</div>
              
              {[
                { to: "/", icon: <Home size={20} />, label: "Home" },
                { to: "/browse", icon: <BookOpen size={20} />, label: "Browse Notes", protected: true },
                ...(isLoggedIn && currentUser?.role !== 'admin' ? [{ to: "/upload", icon: <Upload size={20} />, label: "Upload Note" }] : []),
                ...(isLoggedIn && currentUser?.role === 'admin' ? [
                  { to: "/admin", icon: <LayoutDashboard size={20} />, label: "Admin Dashboard" },
                  { to: "/admin/subjects", icon: <BookOpen size={20} />, label: "Manage Subjects" }
                ] : [])
              ].map((item, idx) => (
                <Link 
                  key={item.label}
                  to={item.to} 
                  onClick={(e) => item.protected ? handleProtectedClick(e, item.to) : closeMenu()}
                  className={`
                    flex items-center gap-4 text-xl font-bold py-4 transition-all duration-300
                    ${location.pathname === item.to ? 'text-[#00C896]' : 'text-[#F5F5F5] active:text-[#00C896]'}
                    animate-fade-right
                  `}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <span className={`${location.pathname === item.to ? 'text-[#00C896]' : 'text-[#52525B]'}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto pb-10 flex flex-col gap-6">
              {!isLoggedIn ? (
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => { navigate('/login'); closeMenu(); }} 
                    className="w-full py-4 rounded-2xl border border-[#1F2023] text-[#F5F5F5] font-bold text-base hover:bg-[#161719] transition-all"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => { navigate('/register'); closeMenu(); }} 
                    className="w-full py-4 rounded-2xl bg-[#00C896] text-[#08090A] font-bold text-base shadow-xl shadow-[#00C896]/20"
                  >
                    Get Started
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {currentUser?.role !== "admin" && (
                    <Link 
                      to="/profile" 
                      onClick={closeMenu}
                      className="flex items-center justify-between p-4 bg-[#161719] rounded-2xl border border-[#1F2023]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#00C896]/10 flex items-center justify-center text-[#00C896] font-bold">
                          {userInitial}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#F5F5F5]">{currentUser?.name}</div>
                          <div className="text-[10px] font-bold text-[#52525B] uppercase tracking-wider">Account Settings</div>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-[#52525B]" />
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center justify-center gap-3 text-[#EF4444] font-bold py-4 w-full rounded-2xl bg-[#EF4444]/5 border border-[#EF4444]/10 active:bg-[#EF4444]/10 transition-all"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}