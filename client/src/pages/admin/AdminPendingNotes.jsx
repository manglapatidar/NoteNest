import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AdminSidebar } from './AdminDashboard';
import SubjectBadge from '../../components/SubjectBadge';
import { getPendingNotes, approveNote, rejectNote, reset} from '../../features/admin/AdminSlice';
import Loader from '../../components/Loader';

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
      <div className="md:ml-56 px-6 py-8 flex-1">

        <div className="opacity-0 animate-fade-up mb-8" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <h1 className="font-display text-2xl font-bold text-[#F5F5F5]">Pending Notes</h1>
          <p className="text-[#52525B] text-sm mt-1">Review and approve or reject submitted notes.</p>
        </div>

        <div className="opacity-0 animate-fade-up mb-6" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <div className="bg-[#0F1012] border border-[#1F2023] rounded-2xl p-5 inline-flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center text-sm">◎</div>
            <div>
              <div className="text-[#52525B] text-xs font-semibold uppercase tracking-widest">Awaiting Review</div>
              <div className="text-[#F59E0B] text-2xl font-bold font-display">
                {isLoading ? '…' : pendingNotes.length}
              </div>
            </div>
          </div>
        </div>

        <div className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl overflow-hidden" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
          <div className="px-6 py-4 border-b border-[#1F2023] flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-base font-bold text-[#F5F5F5]">Pending Notes</h3>
              <span className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 rounded-full px-3 py-1 text-xs font-semibold">
                {filtered.length} notes
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#161719] border border-[#1F2023] rounded-lg px-3 py-1.5 text-sm text-[#A1A1AA] placeholder-[#52525B] outline-none focus:border-[#00C896]/40 transition-colors w-44"
              />
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="bg-[#161719] border border-[#1F2023] rounded-lg px-3 py-1.5 text-sm text-[#A1A1AA] outline-none focus:border-[#00C896]/40 transition-colors"
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <Loader fullScreen={false} />
            ) : filtered.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="text-4xl mb-3 opacity-20">◎</div>
                <div className="text-[#52525B] text-sm">No pending notes found.</div>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-[#08090A]">
                  <tr>
                    {['TITLE', 'SUBJECT', 'UPLOADER', 'TYPE', 'SUBMITTED', 'ACTIONS'].map((h) => (
                      <th key={h} className="px-6 py-4 text-xs font-semibold text-[#52525B] uppercase tracking-widest border-b border-[#1F2023]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2023]">
                  {filtered.map((note, i) => (
                    <tr key={note._id} className="opacity-0 animate-fade-up hover:bg-[#161719]/50 transition-colors" style={{ animationDelay: `${50 * i}ms`, animationFillMode: 'forwards' }}>
                      <td className="px-6 py-4">
                        <div className="max-w-[200px] truncate font-medium text-[#F5F5F5] text-sm">{note.title}</div>
                        {note.description && <div className="text-xs text-[#52525B] mt-0.5 max-w-[200px] truncate">{note.description}</div>}
                      </td>
                      <td className="px-6 py-4"><SubjectBadge subject={note.subject?.name} /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#00C896]/10 text-[#00C896] text-[10px] font-bold flex items-center justify-center">{note.user?.name?.[0]}</div>
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
                            className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 hover:bg-[#10B981] hover:text-[#08090A] rounded-lg px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(note._id)}
                            disabled={isLoading}
                            className="bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444] hover:text-white rounded-lg px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50"
                          >
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