import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import SubjectBadge from '../../components/SubjectBadge';
import { toast } from 'react-toastify'
import Loader from '../../components/Loader';
import { getStats, getNotes, approveNote, rejectNote, deleteNote, reset, } from '../../features/admin/AdminSlice';
import AdminSidebar from '../../components/AdminSidebar';
import { FileText } from 'lucide-react';

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
    <div className="min-h-screen bg-[#08090A] flex pt-16 overflow-x-hidden">
      <AdminSidebar />

      <div className="md:ml-72 px-6 lg:px-10 py-10 flex-1 max-w-full overflow-hidden">

        <div className="opacity-0 animate-fade-up mb-8" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[#52525B] text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 opacity-80">
                System Overview
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F5F5]">
                  {displayName}
                  {showCursor && (
                    <span className="inline-block w-0.5 h-6 bg-[#00C896] ml-1 align-middle animate-pulse" />
                  )}
                </h1>
                <span className="bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/20 rounded-lg px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <p className="text-[#52525B] text-sm mt-1.5 max-w-md">
                {timeGreeting}! Here's a snapshot of what's happening on NoteNest right now.
              </p>
            </div>

            <div className="hidden sm:flex flex-col items-end gap-2.5">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl border border-[#00C896]/40 animate-ping opacity-20" />
                <div className="w-12 h-12 rounded-xl bg-[#00C896]/10 border border-[#00C896]/25 flex items-center justify-center text-[#00C896] text-lg font-bold">
                  {adminName?.[0]?.toUpperCase() ?? 'A'}
                </div>
              </div>
              <span className="text-[#52525B] text-[10px] font-bold bg-[#0F1012] border border-[#1F2023] rounded-lg px-3 py-1 tabular-nums tracking-wider">
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <div className="mt-8 h-px bg-gradient-to-r from-[#1F2023] via-[#00C896]/20 to-transparent" />
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <div key={i} className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl p-5 hover:-translate-y-1 hover:border-[#00C896]/30 transition-all duration-300 relative overflow-hidden group" style={{ animationDelay: stat.delay, animationFillMode: 'forwards' }}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[#52525B] text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-transform group-hover:scale-110 ${stat.iconCol}`}>{stat.icon}</div>
              </div>
              <div className={`font-display text-4xl font-bold mb-2 tracking-tight ${stat.valCol}`}>
                {isLoading ? '…' : stat.value}
              </div>
              <div className={`text-[11px] font-medium ${stat.footCol}`}>{stat.footer}</div>
              <div className={`absolute bottom-0 left-0 h-1 transition-all duration-300 group-hover:w-full w-8 ${stat.acc}`}></div>
            </div>
          ))}
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-8">
          <div className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl p-6 hover:border-[#1F2023] transition-all" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-sm font-bold text-[#F5F5F5] flex items-center gap-2">
                <div className="w-1 h-4 bg-[#00C896] rounded-full"></div>
                Notes Distribution
              </h3>
              <span className="text-[10px] text-[#52525B] font-bold uppercase tracking-wider">Per Subject</span>
            </div>
            {chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[240px] text-[#52525B] gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#1F2023] flex items-center justify-center text-xl opacity-50">📊</div>
                <span className="text-sm font-medium">{isLoading ? 'Fetching data...' : 'No data available'}</span>
              </div>
            ) : (
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#1F2023" />
                    <XAxis dataKey="subject" tick={{ fill: '#52525B', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#52525B', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0, 200, 150, 0.05)' }}
                      contentStyle={{ backgroundColor: '#08090A', border: '1px solid #1F2023', borderRadius: '12px', padding: '12px' }}
                      itemStyle={{ color: '#00C896', fontSize: '12px', fontWeight: 'bold' }}
                      labelStyle={{ color: '#F5F5F5', marginBottom: '4px', fontSize: '11px', fontWeight: '800' }}
                    />
                    <Bar dataKey="totalNotes" name="Notes" fill="#00C896" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl p-6 hover:border-[#1F2023] transition-all" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-sm font-bold text-[#F5F5F5] flex items-center gap-2">
                <div className="w-1 h-4 bg-[#F59E0B] rounded-full"></div>
                Rating Performance
              </h3>
              <span className="text-[10px] text-[#52525B] font-bold uppercase tracking-wider">Average Score</span>
            </div>
            {chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[240px] text-[#52525B] gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#1F2023] flex items-center justify-center text-xl opacity-50">⭐</div>
                <span className="text-sm font-medium">{isLoading ? 'Fetching data...' : 'No data available'}</span>
              </div>
            ) : (
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#1F2023" />
                    <XAxis dataKey="subject" tick={{ fill: '#52525B', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 5]} tick={{ fill: '#52525B', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <ReferenceLine y={3} stroke="#1F2023" strokeDasharray="4 4" />
                    <Tooltip 
                      cursor={{ fill: 'rgba(245, 158, 11, 0.05)' }}
                      contentStyle={{ backgroundColor: '#08090A', border: '1px solid #1F2023', borderRadius: '12px', padding: '12px' }}
                      itemStyle={{ color: '#F59E0B', fontSize: '12px', fontWeight: 'bold' }}
                      labelStyle={{ color: '#F5F5F5', marginBottom: '4px', fontSize: '11px', fontWeight: '800' }}
                    />
                    <Bar dataKey="avgRating" name="Avg Rating" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* PENDING TABLE */}
        <div className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl overflow-hidden mb-8 shadow-xl shadow-black/20" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
          <div className="px-6 py-5 border-b border-[#1F2023] flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-base font-bold text-[#F5F5F5]">Pending Review</h3>
              <span className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">{pendingNotes.length}</span>
            </div>
            <Link to="/admin/pending" className="text-xs font-bold text-[#00C896] hover:text-[#00E5B0] transition-colors">View All &rarr;</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-[#08090A]">
                <tr>
                  {['TITLE', 'SUBJECT', 'UPLOADER', 'SUBMITTED', 'ACTIONS'].map(h => (
                    <th key={h} className="px-6 py-4 text-[10px] font-bold text-[#52525B] uppercase tracking-[0.15em] border-b border-[#1F2023]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2023]">
                {pendingNotes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                        <div className="text-2xl">✨</div>
                        <p className="text-[#52525B] text-sm font-medium">All caught up! No pending notes.</p>
                      </div>
                    </td>
                  </tr>
                )}
                {pendingNotes.slice(0, 5).map((note, i) => (
                  <tr key={note._id} className="hover:bg-[#161719]/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="max-w-[240px] truncate font-bold text-[#F5F5F5] text-sm" title={note.title}>{note.title}</div>
                      <div className="text-[10px] text-[#52525B] font-mono mt-0.5">ID: {note._id.slice(-8)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <SubjectBadge subject={note.subject?.name ?? note.subject} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00C896]/20 to-[#00C896]/5 border border-[#00C896]/20 text-[#00C896] text-[10px] font-bold flex items-center justify-center">
                          {note.user?.name?.[0]}
                        </div>
                        <span className="text-[#A1A1AA] text-sm font-medium">{note.user?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#52525B] text-xs font-medium tabular-nums">{new Date(note.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/notes/${note._id}`} className="p-2 text-[#52525B] hover:text-[#00C896] transition-colors" title="View details">
                          <FileText size={16} />
                        </Link>
                        <button
                          onClick={() => handleApprove(note._id)}
                          disabled={isLoading}
                          className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 hover:bg-[#10B981] hover:text-[#08090A] rounded-lg px-3 py-1.5 text-xs font-bold transition-all disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(note._id)}
                          disabled={isLoading}
                          className="bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444] hover:text-white rounded-lg px-3 py-1.5 text-xs font-bold transition-all disabled:opacity-50"
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

        {/* ALL NOTES TABLE */}
        <div className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl overflow-hidden mb-8 shadow-xl shadow-black/20" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
          <div className="px-6 py-5 border-b border-[#1F2023] flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-base font-bold text-[#F5F5F5]">Recent Platform Activity</h3>
              <span className="bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/20 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">{notes.length} total</span>
            </div>
            <Link to="/admin/all" className="text-xs font-bold text-[#00C896] hover:text-[#00E5B0] transition-colors">Manage Library &rarr;</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-[#08090A]">
                <tr>
                  {['TITLE', 'SUBJECT', 'STATUS', 'DATE', 'ACTIONS'].map(h => (
                    <th key={h} className="px-6 py-4 text-[10px] font-bold text-[#52525B] uppercase tracking-[0.15em] border-b border-[#1F2023]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2023]">
                {notes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[#52525B] text-sm">No notes found on the platform.</td>
                  </tr>
                ) : (
                  notes.slice(0, 10).map((note, i) => (
                    <tr key={note._id} className="hover:bg-[#161719]/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="max-w-[240px] truncate font-bold text-[#F5F5F5] text-sm">{note.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <SubjectBadge subject={note.subject?.name ?? note.subject} />
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg border ${
                          note.status === 'approved' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' :
                          note.status === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' :
                          'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'
                        }`}>
                          {note.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#52525B] text-xs font-medium">{new Date(note.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/notes/${note._id}`} className="p-2 text-[#52525B] hover:text-[#00C896] transition-colors">
                            <FileText size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(note._id)}
                            className="p-2 text-[#52525B] hover:text-[#EF4444] transition-colors"
                          >
                            <svg size={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}