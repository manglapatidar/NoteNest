import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AdminSidebar } from './AdminDashboard';
import SubjectBadge from '../../components/SubjectBadge';
import { getAllNotes, deleteNote, reset } from '../../features/admin/AdminSlice';
import Loader from '../../components/Loader';

const StatusBadge = ({ status }) => {
  const styles = {
    approved: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
    pending:  'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    rejected: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
  };
  return (
    <span className={`border rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

export default function AdminAllNotes() {
  const dispatch = useDispatch();
  const { allNotes, isLoading, isError, message } = useSelector((state) => state.admin);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(getAllNotes());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this note?')) return;
    dispatch(deleteNote(id))
      .unwrap()
      .then(() => toast.success('Note deleted'))
      .catch((err) => toast.error(err));
  };

  const filtered = allNotes.filter((n) =>
    (!search || n.title?.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || n.status === statusFilter)
  );

  return (
    <div className="min-h-screen bg-[#08090A] flex pt-16">
      <AdminSidebar />
      <div className="md:ml-56 px-6 py-8 flex-1">

        <div className="opacity-0 animate-fade-up mb-8" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <h1 className="font-display text-2xl font-bold text-[#F5F5F5]">All Notes</h1>
          <p className="text-[#52525B] text-sm mt-1">View and manage all notes on the platform.</p>
        </div>

        <div className="opacity-0 animate-fade-up grid grid-cols-3 gap-4 mb-6" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          {[
            { label: 'Total',    value: allNotes.length,                                          icon: '◉', col: 'text-[#F5F5F5]', bg: 'bg-[#00C896]/10 text-[#00C896]' },
            { label: 'Approved', value: allNotes.filter((n) => n.status === 'approved').length,   icon: '✓', col: 'text-[#10B981]', bg: 'bg-[#10B981]/10 text-[#10B981]' },
            { label: 'Pending',  value: allNotes.filter((n) => n.status === 'pending').length,    icon: '◎', col: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10 text-[#F59E0B]' },
          ].map((s, i) => (
            <div key={i} className="bg-[#0F1012] border border-[#1F2023] rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${s.bg}`}>{s.icon}</div>
              <div>
                <div className="text-[#52525B] text-xs font-semibold uppercase tracking-widest">{s.label}</div>
                <div className={`text-2xl font-bold font-display ${s.col}`}>
                  {isLoading ? '…' : s.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl overflow-hidden" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
          <div className="px-6 py-4 border-b border-[#1F2023] flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-base font-bold text-[#F5F5F5]">All Notes</h3>
              <span className="bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/20 rounded-full px-3 py-1 text-xs font-semibold">
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#161719] border border-[#1F2023] rounded-lg px-3 py-1.5 text-sm text-[#A1A1AA] outline-none focus:border-[#00C896]/40 transition-colors"
              >
                <option value="">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <Loader fullScreen={false} />
            ) : filtered.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="text-4xl mb-3 opacity-20">≡</div>
                <div className="text-[#52525B] text-sm">No notes found.</div>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-[#08090A]">
                  <tr>
                    {['TITLE', 'SUBJECT', 'UPLOADER', 'TYPE', 'STATUS', 'DATE', 'ACTIONS'].map((h) => (
                      <th key={h} className="px-6 py-4 text-xs font-semibold text-[#52525B] uppercase tracking-widest border-b border-[#1F2023]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2023]">
                  {filtered.map((note, i) => (
                    <tr key={note._id} className="opacity-0 animate-fade-up hover:bg-[#161719]/50 transition-colors" style={{ animationDelay: `${50 * i}ms`, animationFillMode: 'forwards' }}>
                      <td className="px-6 py-4">
                        <div className="max-w-[180px] truncate font-medium text-[#F5F5F5] text-sm">{note.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <SubjectBadge subject={note.subject?.name ?? note.subject} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#00C896]/10 text-[#00C896] text-[10px] font-bold flex items-center justify-center">
                            {note.user?.name?.[0]}
                          </div>
                          <span className="text-[#A1A1AA] text-sm">{note.user?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-[#52525B] bg-[#161719] border border-[#1F2023] rounded-lg px-2 py-0.5">
                          {note.fileUrl ? 'PDF' : 'TXT'}
                        </span>
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={note.status} /></td>
                      <td className="px-6 py-4 text-[#52525B] text-sm">{new Date(note.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link to={`/notes/${note._id}`} className="text-[#00C896] hover:underline text-xs">View</Link>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}