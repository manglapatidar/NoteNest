import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/AdminSidebar';
import SubjectBadge from '../../components/SubjectBadge';
import { getPendingNotes, approveNote, rejectNote, reset} from '../../features/admin/AdminSlice';
import Loader from '../../components/Loader';
import { Search, Filter, CheckCircle2, XCircle, Eye } from 'lucide-react';

export default function AdminPendingNotes() {
  const dispatch = useDispatch();
  const { pendingNotes, isLoading, isError, message } = useSelector((state) => state.admin);

  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  // Fetch pending notes on mount
  useEffect(() => {
    dispatch(getPendingNotes());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  const handleApprove = (id) => {
    dispatch(approveNote(id))
      .unwrap()
      .then(() => toast.success('Note approved!'))
      .catch((err) => toast.error(err));
  };

  const handleReject = (id) => {
    dispatch(rejectNote(id))
      .unwrap()
      .then(() => toast.error('Note rejected'))
      .catch((err) => toast.error(err));
  };

  // Filter options from current pendingNotes
  const subjects = [...new Set(pendingNotes.map((n) => n.subject?.name).filter(Boolean))];

  const filtered = pendingNotes.filter((n) =>
    (!search || n.title?.toLowerCase().includes(search.toLowerCase())) &&
    (!subjectFilter || n.subject?.name === subjectFilter)
  );

  return (
    <div className="min-h-screen bg-[#08090A] flex pt-16">
      <AdminSidebar />
      <div className="md:ml-72 px-6 lg:px-10 py-10 flex-1 max-w-full overflow-hidden">

        <div className="opacity-0 animate-fade-up mb-8" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <h1 className="font-display text-3xl font-bold text-[#F5F5F5] flex items-center gap-3">Pending Notes</h1>
          <p className="text-[#52525B] text-sm mt-1">Review and approve or reject submitted notes before they go live.</p>
        </div>

        <div className="opacity-0 animate-fade-up mb-8 flex flex-wrap gap-4" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <div className="bg-[#0F1012] border border-[#1F2023] rounded-2xl p-5 flex items-center gap-4 min-w-[200px]">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center">
              <Filter size={20} />
            </div>
            <div>
              <div className="text-[#52525B] text-[10px] font-bold uppercase tracking-wider">Awaiting Review</div>
              <div className="text-[#F59E0B] text-2xl font-bold font-display tracking-tight">
                {isLoading ? '…' : pendingNotes.length}
              </div>
            </div>
          </div>
        </div>

        <div className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl overflow-hidden shadow-xl shadow-black/20" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
          <div className="px-6 py-5 border-b border-[#1F2023] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-base font-bold text-[#F5F5F5]">Verification Queue</h3>
              <span className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                {filtered.length} notes
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B] group-focus-within:text-[#00C896] transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#161719] border border-[#1F2023] rounded-xl pl-10 pr-4 py-2 text-sm text-[#F5F5F5] placeholder-[#52525B] outline-none focus:border-[#00C896]/40 transition-all w-full sm:w-64"
                />
              </div>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="bg-[#161719] border border-[#1F2023] rounded-xl px-4 py-2 text-sm text-[#A1A1AA] outline-none focus:border-[#00C896]/40 transition-all cursor-pointer"
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-12"><Loader fullScreen={false} /></div>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-20 text-center">
                <div className="text-5xl mb-4 opacity-20 flex justify-center">🔍</div>
                <h4 className="text-[#F5F5F5] font-bold mb-1">No matching notes</h4>
                <p className="text-[#52525B] text-sm">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <table className="w-full text-left min-w-[900px]">
                <thead className="bg-[#08090A]">
                  <tr>
                    {['TITLE', 'SUBJECT', 'UPLOADER', 'TYPE', 'SUBMITTED', 'ACTIONS'].map((h) => (
                      <th key={h} className="px-6 py-4 text-[10px] font-bold text-[#52525B] uppercase tracking-[0.15em] border-b border-[#1F2023]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2023]">
                  {filtered.map((note, i) => (
                    <tr key={note._id} className="hover:bg-[#161719]/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="max-w-[240px] truncate font-bold text-[#F5F5F5] text-sm" title={note.title}>{note.title}</div>
                        {note.description && <div className="text-[10px] text-[#52525B] mt-1 max-w-[240px] truncate font-medium">{note.description}</div>}
                      </td>
                      <td className="px-6 py-4"><SubjectBadge subject={note.subject?.name} /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00C896]/20 to-[#00C896]/5 border border-[#00C896]/20 text-[#00C896] text-[10px] font-bold flex items-center justify-center">
                            {note.user?.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="text-[#A1A1AA] text-sm font-medium">{note.user?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-[10px] font-bold text-[#52525B] bg-[#161719] border border-[#1F2023] rounded-lg px-2 py-1 uppercase tracking-wider">{note.fileUrl ? 'PDF' : 'TXT'}</span>
                      </td>
                      <td className="px-6 py-4 text-[#52525B] text-xs font-medium tabular-nums">{new Date(note.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/notes/${note._id}`} className="p-2 text-[#52525B] hover:text-[#00C896] transition-colors" title="View details">
                            <Eye size={18} />
                          </Link>
                          <button
                            onClick={() => handleApprove(note._id)}
                            disabled={isLoading}
                            className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 hover:bg-[#10B981] hover:text-[#08090A] rounded-lg px-3 py-1.5 text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
                          >
                            <CheckCircle2 size={14} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(note._id)}
                            disabled={isLoading}
                            className="bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444] hover:text-white rounded-lg px-3 py-1.5 text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}