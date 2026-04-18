import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminDashboard';
import SubjectBadge from '../../components/SubjectBadge';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8080/api/subjects';

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

      <div className="md:ml-56 px-6 py-8 flex-1 max-w-4xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-2xl font-bold text-[#F5F5F5]">Manage Subjects</h1>
          <span className="bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/20 rounded-lg px-3 py-1 font-semibold text-sm">
            {subjects.length} subjects
          </span>
        </div>

        {/* ADD SUBJECT */}
        <div className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl p-6 mb-6" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <label className="block text-[#52525B] text-xs font-semibold uppercase tracking-widest mb-3">Add New Subject</label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g. Political Science"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1 bg-[#161719] border border-[#1F2023] rounded-xl px-4 py-3 text-[#F5F5F5] text-sm placeholder-[#52525B] focus:outline-none focus:border-[#00C896] focus:ring-1 focus:ring-[#00C896]/20 transition-all duration-200"
            />
            <button
              onClick={handleAdd}
              className="bg-[#00C896] hover:bg-[#00A87E] text-[#08090A] font-semibold text-sm rounded-xl px-6 py-3 hover:scale-[1.02] transition-all duration-200 whitespace-nowrap"
            >
              Add Subject
            </button>
          </div>
        </div>

        {/* SUBJECTS TABLE */}
        <div className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl overflow-hidden" style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
          <div className="px-6 py-4 border-b border-[#1F2023]">
            <h3 className="font-display text-base font-bold text-[#F5F5F5]">All Subjects</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#08090A]">
                <tr>
                  {['#', 'SUBJECT NAME', 'ACTIONS'].map((h) => (
                    <th key={h} className="px-6 py-4 text-xs font-semibold text-[#52525B] uppercase tracking-widest border-b border-[#1F2023]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2023]">
                {subjects.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-[#52525B] text-sm">No subjects yet. Add one above.</td>
                  </tr>
                ) : (
                  subjects.map((sub, i) => (
                    <tr key={sub._id} className="opacity-0 animate-fade-up hover:bg-[#161719]/50 transition-colors" style={{ animationDelay: `${50 * i}ms`, animationFillMode: 'forwards' }}>
                      <td className="px-6 py-4 text-[#52525B] text-xs font-mono">{String(i + 1).padStart(2, '0')}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[#F5F5F5] font-medium text-sm">{sub.name}</span>
                          <SubjectBadge subject={sub.name} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleDelete(sub._id)} className="text-[#52525B] hover:text-[#EF4444] text-xs hover:scale-105 transition-all">
                          Delete
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