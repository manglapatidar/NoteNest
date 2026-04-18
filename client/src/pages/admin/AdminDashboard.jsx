import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import SubjectBadge from '../../components/SubjectBadge';
import { toast } from 'react-toastify'
import Loader from '../../components/Loader';
import { getStats, getNotes, approveNote, rejectNote, deleteNote, reset, } from '../../features/admin/AdminSlice';

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', icon: '⊞', path: '/admin' },
    { label: 'Pending Notes', icon: '◎', path: '/admin/pending' },
    { label: 'All Notes', icon: '≡', path: '/admin/all' },
    { label: 'Saved Notes', icon: '♥', path: '/admin/saved' },
    { label: 'Subjects', icon: '◈', path: '/admin/subjects' },
  ];

  return (
    <div className="w-56 fixed left-0 top-16 bottom-0 bg-[#0F1012] border-r border-[#1F2023] px-3 py-6 hidden md:flex flex-col gap-1 opacity-0 animate-fade-right z-40" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
      <div className="text-[#52525B] text-xs font-semibold uppercase tracking-widest px-3 mb-3">Admin Panel</div>

      {navItems.map((item, i) => {
        const isActive = location.pathname === item.path;
        return (
          <div
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer hover:translate-x-0.5 opacity-0 animate-fade-right ${isActive ? 'bg-[#00C896]/8 text-[#00C896] border border-[#00C896]/15' : 'text-[#52525B] hover:bg-[#161719] hover:text-[#A1A1AA] border border-transparent'
              }`}
            style={{ animationDelay: `${150 + i * 100}ms`, animationFillMode: 'forwards' }}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        );
      })}

      <div className="mt-auto border-t border-[#1F2023] pt-4 flex items-center gap-2 px-2">
        <div className="w-7 h-7 rounded-lg bg-[#00C896]/10 text-[#00C896] text-xs font-bold flex items-center justify-center">A</div>
        <span className="text-[#A1A1AA] text-sm">Admin User</span>
        <span className="ml-auto bg-[#00C896]/10 text-[#00C896] rounded px-1.5 py-0.5 text-[10px] uppercase font-bold">Admin</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { notes = [], stats = null, isLoading, isError, message } = useSelector((state) => state.admin);

  const pendingNotes = notes.filter((n) => n.status === 'pending');
  const approvedNotes = notes.filter((n) => n.status === 'approved');

  const adminName = useSelector((state) => state.auth?.user?.name ?? state.user?.name ?? 'Admin');
  const [displayName, setDisplayName] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const hour = currentTime.getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fullText = `Hello, ${adminName}`;
    let i = 0;
    setDisplayName('');
    const interval = setInterval(() => {
      setDisplayName(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        setTimeout(() => setShowCursor(false), 1200);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [adminName]);

  useEffect(() => {
    dispatch(getStats());
    dispatch(getNotes());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  const handleApprove = (noteId) => {
    dispatch(approveNote(noteId))
      .unwrap()
      .then(() => toast.success('Note approved'))
      .catch((err) => toast.error(err));
  };

  const handleReject = (noteId) => {
    dispatch(rejectNote(noteId))
      .unwrap()
      .then(() => toast.success('Note rejected'))
      .catch((err) => toast.error(err));
  };

  const handleDelete = (noteId) => {
    dispatch(deleteNote(noteId))
      .unwrap()
      .then(() => toast.success('Note deleted'))
      .catch((err) => toast.error(err));
  };

  // stats backend se array 
  const chartData = Array.isArray(stats)
    ? stats.map((item) => ({
        subject: item.subject ?? item.name ?? item._id ?? 'Unknown',
        totalNotes: item.totalNotes ?? item.notes ?? item.count ?? 0,
        avgRating: parseFloat((item.avgRating ?? item.rating ?? item.avg ?? 0).toFixed(2)),
      }))
    : [];

  const statCards = [
    { label: 'Total Notes', icon: '◉', value: notes.length, footer: `↑ +${pendingNotes.length} pending`, iconCol: 'text-[#00C896] bg-[#00C896]/10', footCol: 'text-[#10B981]', valCol: 'text-[#F5F5F5]', acc: 'bg-[#00C896]', delay: '150ms' },
    { label: 'Pending', icon: '◎', value: pendingNotes.length, footer: 'awaiting action', iconCol: 'text-[#F59E0B] bg-[#F59E0B]/10', footCol: 'text-[#52525B]', valCol: 'text-[#F59E0B]', acc: 'bg-[#F59E0B]', delay: '250ms' },
    { label: 'Approved', icon: '✓', value: approvedNotes.length, footer: 'live on platform', iconCol: 'text-[#10B981] bg-[#10B981]/10', footCol: 'text-[#52525B]', valCol: 'text-[#10B981]', acc: 'bg-[#10B981]', delay: '350ms' },
    { label: 'Subjects', icon: '◈', value: Array.isArray(stats) ? stats.length : 0, footer: 'active categories', iconCol: 'text-[#00C896] bg-[#00C896]/10', footCol: 'text-[#52525B]', valCol: 'text-[#F5F5F5]', acc: 'bg-[#00C896]', delay: '450ms' },
  ];

  return (
    <div className="min-h-screen bg-[#08090A] flex pt-16">
      <AdminSidebar />

      <div className="md:ml-56 px-6 py-8 flex-1">

        <div className="opacity-0 animate-fade-up mb-8" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#52525B] text-xs font-semibold uppercase tracking-widest mb-1.5">
                Welcome back
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-display text-2xl font-bold text-[#F5F5F5]">
                  {displayName}
                  {showCursor && (
                    <span className="inline-block w-0.5 h-6 bg-[#00C896] ml-1 align-middle animate-pulse" />
                  )}
                </h1>
                <span className="bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/20 rounded-md px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <p className="text-[#52525B] text-sm mt-1.5">
                {timeGreeting}! Here's your platform overview.
              </p>
            </div>

            <div className="hidden sm:flex flex-col items-end gap-2.5">
              <div className="relative">
                <div className="absolute inset-0 rounded-full border border-[#00C896]/40 animate-ping" />
                <div className="w-12 h-12 rounded-full bg-[#00C896]/10 border border-[#00C896]/25 flex items-center justify-center text-[#00C896] text-lg font-bold">
                  {adminName?.[0]?.toUpperCase() ?? 'A'}
                </div>
              </div>
              <span className="text-[#52525B] text-xs bg-[#0F1012] border border-[#1F2023] rounded-lg px-3 py-1 tabular-nums">
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <div className="mt-5 h-px bg-gradient-to-r from-[#00C896]/30 via-[#00C896]/10 to-transparent" />
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <div key={i} className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl p-5 hover:-translate-y-1 hover:border-[#00C896]/20 hover:shadow-lg hover:shadow-[#00C896]/5 transition-all duration-300 relative overflow-hidden" style={{ animationDelay: stat.delay, animationFillMode: 'forwards' }}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[#52525B] text-xs font-semibold uppercase tracking-widest">{stat.label}</span>
                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${stat.iconCol}`}>{stat.icon}</div>
              </div>
              <div className={`font-display text-4xl font-bold mb-2 ${stat.valCol}`}>
                {isLoading ? '…' : stat.value}
              </div>
              <div className={`text-xs ${stat.footCol}`}>{stat.footer}</div>
              <div className={`absolute bottom-0 left-5 h-0.5 w-10 ${stat.acc}`}></div>
            </div>
          ))}
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <div className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl p-6" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
            <h3 className="font-display text-sm font-bold text-[#F5F5F5] mb-6">Notes per Subject</h3>
            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-[220px] text-[#52525B] text-sm">
                {isLoading ? <Loader fullScreen={false} /> : 'No data available'}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barSize={28}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#1F2023" />
                  <XAxis dataKey="subject" tick={{ fill: '#52525B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#52525B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F1012', border: '1px solid #1F2023', borderRadius: '12px', color: '#F5F5F5', fontSize: '12px' }} cursor={{ fill: '#161719' }} />
                  <Bar dataKey="totalNotes" name="Notes" fill="#00C896" radius={[6, 6, 0, 0]} animationDuration={1200} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl p-6" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
            <h3 className="font-display text-sm font-bold text-[#F5F5F5] mb-6">Avg Rating per Subject</h3>
            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-[220px] text-[#52525B] text-sm">
                {isLoading ? <Loader fullScreen={false} /> : 'No data available'}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barSize={28}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#1F2023" />
                  <XAxis dataKey="subject" tick={{ fill: '#52525B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 5]} tick={{ fill: '#52525B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <ReferenceLine y={3} stroke="#1F2023" strokeDasharray="4 4" />
                  <Tooltip contentStyle={{ backgroundColor: '#0F1012', border: '1px solid #1F2023', borderRadius: '12px', color: '#F5F5F5', fontSize: '12px' }} cursor={{ fill: '#161719' }} />
                  <Bar dataKey="avgRating" name="Avg Rating" fill="#F59E0B" radius={[6, 6, 0, 0]} animationDuration={1400} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* PENDING TABLE */}
        <div className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl overflow-hidden mb-8" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
          <div className="px-6 py-4 border-b border-[#1F2023] flex justify-between items-center">
            <h3 className="font-display text-base font-bold text-[#F5F5F5]">Pending Review</h3>
            <span className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 rounded-full px-3 py-1 text-xs">{pendingNotes.length} notes</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#08090A]">
                <tr>
                  {['TITLE', 'SUBJECT', 'UPLOADER', 'TYPE', 'SUBMITTED', 'ACTIONS'].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-semibold text-[#52525B] uppercase tracking-widest border-b border-[#1F2023]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2023]">
                {pendingNotes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[#52525B] text-sm">No pending notes</td>
                  </tr>
                )}
                {pendingNotes.map((note, i) => (
                  <tr key={note._id} className="opacity-0 animate-fade-up hover:bg-[#161719]/50 transition-colors group" style={{ animationDelay: `${50 * i}ms`, animationFillMode: 'forwards' }}>
                    <td className="px-6 py-4">
                      <div className="max-w-[200px] truncate font-medium text-[#F5F5F5] text-sm" title={note.title}>{note.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <SubjectBadge subject={note.subject?.name ?? note.subject} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#00C896]/10 text-[#00C896] text-[10px] font-bold flex items-center justify-center">
                          {note.user?.name?.[0]}
                        </div>
                        <span className="text-[#A1A1AA] text-sm">{note.user?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-[#52525B] bg-[#161719] border border-[#1F2023] rounded-lg px-2 py-0.5">{note.fileUrl ? 'PDF' : 'TXT'}</span>
                    </td>
                    <td className="px-6 py-4 text-[#52525B] text-sm">{new Date(note.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/notes/${note._id}`} className="text-[#00C896] hover:underline text-xs">View</Link>
                        <button
                          onClick={() => handleApprove(note._id)}
                          disabled={isLoading}
                          className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 hover:bg-[#10B981] hover:text-[#08090A] hover:scale-105 active:scale-95 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(note._id)}
                          disabled={isLoading}
                          className="bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444] hover:text-white hover:scale-105 active:scale-95 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENTLY APPROVED TABLE */}
        <div className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl overflow-hidden mb-8" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
          <div className="px-6 py-4 border-b border-[#1F2023] flex justify-between items-center">
            <h3 className="font-display text-base font-bold text-[#F5F5F5]">Recently Approved</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#08090A]">
                <tr>
                  {['TITLE', 'SUBJECT', 'UPLOADER', 'AVG RATING', 'SAVES', 'DATE', 'ACTIONS'].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-semibold text-[#52525B] uppercase tracking-widest border-b border-[#1F2023]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2023]">
                {approvedNotes.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-[#52525B] text-sm">No approved notes</td>
                  </tr>
                )}
                {approvedNotes.map((note, i) => (
                  <tr key={note._id} className="opacity-0 animate-fade-up hover:bg-[#161719]/50 transition-colors group" style={{ animationDelay: `${50 * i}ms`, animationFillMode: 'forwards' }}>
                    <td className="px-6 py-4">
                      <div className="max-w-[200px] truncate font-medium text-[#F5F5F5] text-sm" title={note.title}>{note.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <SubjectBadge subject={note.subject?.name ?? note.subject} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#00C896]/10 text-[#00C896] text-[10px] font-bold flex items-center justify-center">
                          {note.user?.name?.[0]}
                        </div>
                        <span className="text-[#A1A1AA] text-sm">{note.user?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#F59E0B] text-sm font-medium">★ {note.avgRating?.toFixed(1)}</td>
                    <td className="px-6 py-4 text-[#52525B] text-sm">{note.saves?.length ?? 0}</td>
                    <td className="px-6 py-4 text-[#52525B] text-sm">{new Date(note.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(note._id)}
                          disabled={isLoading}
                          className="text-[#52525B] hover:text-[#EF4444] text-xs transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}