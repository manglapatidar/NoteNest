import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import SubjectBadge from '../../components/SubjectBadge';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = '/api/subjects';

export default function SubjectManager() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');

  const { user } = useSelector((state) => state.auth);
  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setSubjects(data);
    } catch (error) {
      toast.error('Failed to load subjects');
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Add subject
  const handleAdd = async () => {
    if (!newSubject.trim()) return;
    try {
      const { data } = await axios.post(API_URL, { name: newSubject.trim() }, config);
      setSubjects([data, ...subjects]);
      setNewSubject('');
      toast.success('Subject added!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add');
    }
  };

  // Delete subject
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, config);
      setSubjects(subjects.filter((s) => s._id !== id));
      toast.success('Subject removed');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-[#08090A] flex pt-16">
      <AdminSidebar />
      <div className="md:ml-72 px-6 lg:px-10 py-10 flex-1 max-w-full overflow-hidden">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F5F5]">Manage Subjects</h1>
            <p className="text-[#52525B] text-sm mt-1">Configure and manage note categories</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/20 rounded-lg px-3 py-1 font-bold text-xs uppercase tracking-wider">
              {subjects.length} active
            </span>
          </div>
        </div>

        {/* ADD SUBJECT */}
        <div className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl p-5 sm:p-6 mb-6" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <label className="block text-[#52525B] text-[10px] font-bold uppercase tracking-[0.15em] mb-3">Add New Subject</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. Artificial Intelligence"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1 bg-[#161719] border border-[#1F2023] rounded-xl px-4 py-3 text-[#F5F5F5] text-sm placeholder-[#52525B] focus:outline-none focus:border-[#00C896] focus:ring-1 focus:ring-[#00C896]/20 transition-all duration-200"
            />
            <button
              onClick={handleAdd}
              className="bg-[#00C896] hover:bg-[#00E5B0] text-[#08090A] font-bold text-sm rounded-xl px-6 py-3 shadow-lg shadow-[#00C896]/10 hover:shadow-[#00C896]/20 active:scale-95 transition-all duration-200 whitespace-nowrap"
            >
              Add Subject
            </button>
          </div>
        </div>

        {/* SUBJECTS TABLE */}
        <div className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl overflow-hidden shadow-xl shadow-black/20" style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
          <div className="px-6 py-5 border-b border-[#1F2023]">
            <h3 className="font-display text-base font-bold text-[#F5F5F5]">All Categories</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead className="bg-[#08090A]">
                <tr>
                  {['#', 'SUBJECT NAME', 'PREVIEW', 'ACTIONS'].map((h) => (
                    <th key={h} className="px-6 py-4 text-[10px] font-bold text-[#52525B] uppercase tracking-[0.15em] border-b border-[#1F2023]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2023]">
                {subjects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-[#52525B] text-sm">
                      <div className="flex flex-col items-center gap-3 opacity-40">
                        <div className="text-3xl">📁</div>
                        <p>No subjects found. Add your first category above.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  subjects.map((sub, i) => (
                    <tr key={sub._id} className="hover:bg-[#161719]/50 transition-colors group">
                      <td className="px-6 py-4 text-[#52525B] text-xs font-bold tabular-nums">{String(i + 1).padStart(2, '0')}</td>
                      <td className="px-6 py-4">
                        <span className="text-[#F5F5F5] font-bold text-sm">{sub.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <SubjectBadge subject={sub.name} />
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleDelete(sub._id)} 
                          className="p-2 text-[#52525B] hover:text-[#EF4444] transition-colors rounded-lg hover:bg-[#EF4444]/5"
                          title="Delete Subject"
                        >
                          <svg size={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
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