import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  List, 
  Heart, 
  BookMarked, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { toast } from 'react-toastify';

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { label: 'Overview', icon: <LayoutDashboard size={18} />, path: '/admin', color: 'text-blue-400' },
    { label: 'Pending Notes', icon: <FileText size={18} />, path: '/admin/pending', color: 'text-amber-400' },
    { label: 'All Notes', icon: <List size={18} />, path: '/admin/all', color: 'text-emerald-400' },
    { label: 'Saved Notes', icon: <Heart size={18} />, path: '/admin/saved', color: 'text-rose-400' },
    { label: 'Subjects', icon: <BookMarked size={18} />, path: '/admin/subjects', color: 'text-purple-400' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[120] md:hidden w-14 h-14 bg-[#00C896] text-[#08090A] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#00C896]/30 active:scale-95 transition-all duration-300 group"
      >
        <div className="relative w-6 h-6 flex items-center justify-center">
          <Menu className={`absolute transition-all duration-300 ${isOpen ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`} size={24} />
          <X className={`absolute transition-all duration-300 ${isOpen ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`} size={24} />
        </div>
      </button>

      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[100] md:hidden transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeSidebar}
      />

      {/* Sidebar Content */}
      <aside className={`
        fixed left-0 top-16 bottom-0 w-72 bg-[#0F1012] border-r border-[#1F2023] z-[110]
        transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) md:translate-x-0
        ${isOpen ? 'translate-x-0 shadow-[20px_0_60px_rgba(0,0,0,0.5)]' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-8 px-4 no-scrollbar">
            <div className="text-[#52525B] text-[10px] font-bold uppercase tracking-[0.25em] px-4 mb-6 flex items-center gap-2">
              <Zap size={10} className="text-[#00C896]" />
              Main Menu
            </div>

            <nav className="flex flex-col gap-1.5">
              {navItems.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={closeSidebar}
                    style={{ animationDelay: `${idx * 50}ms` }}
                    className={`
                      relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group overflow-hidden
                      ${isActive 
                        ? 'bg-gradient-to-r from-[#00C896]/10 to-transparent text-[#00C896]' 
                        : 'text-[#52525B] hover:text-[#F5F5F5] hover:bg-[#161719]'}
                    `}
                  >
                    {/* Active Indicator Bar */}
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00C896] rounded-full transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`} />
                    
                    <span className={`transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-[#F5F5F5]'}`}>
                      {item.icon}
                    </span>
                    <span className="flex-1 tracking-wide">{item.label}</span>
                    
                    {isActive ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00C896] shadow-[0_0_10px_#00C896]" />
                    ) : (
                      <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile Info Footer */}
          <div className="p-4 bg-[#08090A] border-t border-[#1F2023]">
            <div className="bg-[#161719] rounded-2xl p-4 mb-3 border border-[#1F2023] hover:border-[#00C896]/30 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00C896] to-[#00A87E] flex items-center justify-center text-[#08090A] font-bold text-lg shadow-inner">
                    {user?.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10B981] border-2 border-[#161719] rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#F5F5F5] truncate tracking-tight">{user?.name || 'Admin User'}</div>
                  <div className="text-[10px] font-bold text-[#00C896] uppercase tracking-wider flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-[#00C896]"></div>
                    Super Admin
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 w-full px-4 py-3.5 rounded-2xl text-xs font-bold text-[#EF4444] hover:bg-[#EF4444]/10 border border-transparent hover:border-[#EF4444]/20 transition-all duration-300 group"
            >
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="uppercase tracking-[0.1em]">Terminate Session</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
