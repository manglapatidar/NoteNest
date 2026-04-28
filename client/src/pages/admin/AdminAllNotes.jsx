import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/AdminSidebar';
import SubjectBadge from '../../components/SubjectBadge';
import { getAllNotes, deleteNote, reset } from '../../features/admin/AdminSlice';
import Loader from '../../components/Loader';
import { Search, Filter, Trash2, Eye, FileText, CheckCircle2, Clock } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const styles = {
    approved: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
    pending:  'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    rejected: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
  };
  const Icons = {
    approved: <CheckCircle2 size={10} />,
    pending: <Clock size={10} />,
    rejected: <XCircle size={10} />,
  }
  return (
    <span className={`border rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${styles[status] || styles.pending}`}>
      {Icons[status] || Icons.pending}
      {status}
    </span>
  );
};

const XCircle = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

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
    if (!window.confirm('Are you sure you want to permanently delete this note?')) return;
    dispatch(deleteNote(id))
      .unwrap()
      .then(() => toast.success('Note deleted successfully'))
      .catch((err) => toast.error(err));
  };

  const filtered = allNotes.filter((n) =>
    (!search || n.title?.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || n.status === statusFilter)
  );

  const stats = [
    { label: 'Total Notes', value: allNotes.length, icon: <FileText size={18} />, color: 'text-[#F5F5F5]', bg: 'bg-[#00C896]/10 text-[#00C896]' },
    { label: 'Approved', value: allNotes.filter(n => n.status === 'approved').length, icon: <CheckCircle2 size={18} />, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10 text-[#10B981]' },
    { label: 'Pending', value: allNotes.filter(n => n.status === 'pending').length, icon: <Clock size={18} />, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10 text-[#F59E0B]' },
  ];

  return (
    <div className="min-h-screen bg-[#08090A] flex pt-16">
      <AdminSidebar />
      <div className="md:ml-72 px-6 lg:px-10 py-10 flex-1 max-w-full overflow-hidden">

        <div className="opacity-0 animate-fade-up mb-8" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F5F5]">Content Library</h1>
          <p className="text-[#52525B] text-sm mt-1">Full database of all submitted notes on NoteNest.</p>
        </div>

        <div className="opacity-0 animate-fade-up grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          {stats.map((s, i) => (
            <div key={i} className="bg-[#0F1012] border border-[#1F2023] rounded-2xl p-5 flex items-center gap-4 hover:border-[#1F2023]/80 transition-all">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>{s.icon}</div>
              <div>
                <div className="text-[#52525B] text-[10px] font-bold uppercase tracking-wider">{s.label}</div>
                <div className={`text-2xl font-bold font-display tracking-tight ${s.color}`}>
                  {isLoading ? '…' : s.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl overflow-hidden shadow-xl shadow-black/20" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
          <div className="px-6 py-5 border-b border-[#1F2023] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-base font-bold text-[#F5F5F5]">Platform Archive</h3>
              <span className="bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/20 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                {filtered.length} entries
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B] group-focus-within:text-[#00C896] transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Search titles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#161719] border border-[#1F2023] rounded-xl pl-10 pr-4 py-2 text-sm text-[#F5F5F5] placeholder-[#52525B] outline-none focus:border-[#00C896]/40 transition-all w-full sm:w-64"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#161719] border border-[#1F2023] rounded-xl px-4 py-2 text-sm text-[#A1A1AA] outline-none focus:border-[#00C896]/40 transition-all cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-12"><Loader fullScreen={false} /></div>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-20 text-center">
                <div className="text-5xl mb-4 opacity-20 flex justify-center">📂</div>
                <h4 className="text-[#F5F5F5] font-bold mb-1">No notes found</h4>
                <p className="text-[#52525B] text-sm">Try different search terms or filters.</p>
              </div>
            ) : (
              <table className="w-full text-left min-w-[1000px]">
                <thead className="bg-[#08090A]">
                  <tr>
                    {['TITLE', 'SUBJECT', 'UPLOADER', 'TYPE', 'STATUS', 'DATE', 'ACTIONS'].map((h) => (
                      <th key={h} className="px-6 py-4 text-[10px] font-bold text-[#52525B] uppercase tracking-[0.15em] border-b border-[#1F2023]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2023]">
                  {filtered.map((note, i) => (
                    <tr key={note._id} className="hover:bg-[#161719]/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="max-w-[200px] truncate font-bold text-[#F5F5F5] text-sm" title={note.title}>{note.title}</div>
                        <div className="text-[10px] text-[#52525B] font-mono mt-0.5">ID: {note._id.slice(-8)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <SubjectBadge subject={note.subject?.name ?? note.subject} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00C896]/20 to-[#00C896]/5 border border-[#00C896]/20 text-[#00C896] text-[10px] font-bold flex items-center justify-center">
                            {note.user?.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="text-[#A1A1AA] text-sm font-medium">{note.user?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-[10px] font-bold text-[#52525B] bg-[#161719] border border-[#1F2023] rounded-lg px-2 py-1 uppercase tracking-wider">
                          {note.fileUrl ? 'PDF' : 'TXT'}
                        </span>
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={note.status} /></td>
                      <td className="px-6 py-4 text-[#52525B] text-xs font-medium tabular-nums">{new Date(note.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/notes/${note._id}`} className="p-2 text-[#52525B] hover:text-[#00C896] transition-colors" title="View details">
                            <Eye size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(note._id)}
                            disabled={isLoading}
                            className="p-2 text-[#52525B] hover:text-[#EF4444] transition-colors"
                            title="Delete note"
                          >
                            <Trash2 size={18} />
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