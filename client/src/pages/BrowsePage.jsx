import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API_URL = '/api';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First', icon: '↓' },
  { value: 'rating', label: 'Top Rated',    icon: '★' },
  { value: 'saves',  label: 'Most Saved',   icon: '♡' },
];

export default function BrowsePage() {
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activeSubject, setActiveSubject] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user } = useSelector((state) => state.auth);

  const fetchNotes = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/notes`);
      setNotes(data);
    } catch {
      toast.error('Failed to load notes');
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/subjects`);
      setSubjects(data);
    } catch {
      toast.error('Failed to load subjects');
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchSubjects();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredNotes = notes
    .filter((note) => activeSubject === 'All' ? true : note.subject?.name === activeSubject)
    .sort((a, b) => {
      if (sortBy === 'rating') return b.avgRating - a.avgRating;
      if (sortBy === 'saves') return (b.saves?.length ?? 0) - (a.saves?.length ?? 0);
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  const activeSort = SORT_OPTIONS.find((o) => o.value === sortBy);

  return (
    <div className="min-h-screen bg-[#08090A] pt-16">

      {/* TOP BAR */}
      <div className="relative z-40 bg-[#0F1012] border-b border-[#1F2023] px-6 py-5 opacity-0 animate-fade-down" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="font-display text-xl font-bold text-[#F5F5F5]">Browse Notes</h1>

            {user?.role !== 'admin' && (
              <Link
                to="/upload"
                className="bg-[#00C896] hover:bg-[#00A87E] text-[#08090A] font-semibold text-sm rounded-xl px-5 py-2.5 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200"
              >
                + Upload a Note
              </Link>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {/* All button */}
            <button
              onClick={() => setActiveSubject('All')}
              className={`rounded-full px-4 py-1.5 text-sm transition-all ${
                activeSubject === 'All'
                  ? 'bg-[#00C896] text-[#08090A] font-semibold'
                  : 'bg-[#161719] border border-[#1F2023] text-[#A1A1AA] hover:border-[#00C896]/40 hover:text-[#F5F5F5]'
              }`}
            >
              All
            </button>

            {/* Subject buttons */}
            {subjects.map((sub) => (
              <button
                key={sub._id}
                onClick={() => setActiveSubject(sub.name)}
                className={`rounded-full px-4 py-1.5 text-sm transition-all ${
                  activeSubject === sub.name
                    ? 'bg-[#00C896] text-[#08090A] font-semibold'
                    : 'bg-[#161719] border border-[#1F2023] text-[#A1A1AA] hover:border-[#00C896]/40 hover:text-[#F5F5F5]'
                }`}
              >
                {sub.name}
              </button>
            ))}

            {/* CUSTOM SORT DROPDOWN */}
            <div className="ml-auto relative" ref={dropdownRef}>
              <button
                onClick={() => setSortOpen((p) => !p)}
                className={`flex items-center gap-2 bg-[#161719] border rounded-xl px-4 py-1.5 text-sm transition-all duration-200 min-w-[140px] justify-between ${
                  sortOpen
                    ? 'border-[#00C896]/60 text-[#F5F5F5]'
                    : 'border-[#1F2023] text-[#A1A1AA] hover:border-[#00C896]/40 hover:text-[#F5F5F5]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-[#00C896] text-xs">{activeSort.icon}</span>
                  {activeSort.label}
                </span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${sortOpen ? 'rotate-180 text-[#00C896]' : 'text-[#52525B]'}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown panel */}
              {sortOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] w-44 bg-[#0F1012] border border-[#1F2023] rounded-xl overflow-hidden shadow-xl shadow-black/40 z-50 animate-fade-up"
                  style={{ animationDuration: '150ms' }}
                >
                  {SORT_OPTIONS.map((opt, i) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 text-left
                        ${sortBy === opt.value
                          ? 'bg-[#00C896]/10 text-[#00C896]'
                          : 'text-[#A1A1AA] hover:bg-[#161719] hover:text-[#F5F5F5]'
                        }
                        ${i !== 0 ? 'border-t border-[#1F2023]' : ''}
                      `}
                    >
                      <span className={`text-xs w-4 text-center ${sortBy === opt.value ? 'text-[#00C896]' : 'text-[#52525B]'}`}>
                        {opt.icon}
                      </span>
                      {opt.label}
                      {sortBy === opt.value && (
                        <span className="ml-auto text-[#00C896] text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* NOTES GRID */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNotes.map((note, index) => (
            <NoteCard key={note._id} note={note} index={index} />
          ))}
          {filteredNotes.length === 0 && (
            <div className="col-span-full py-20 text-center text-[#52525B]">
              No notes found for this category.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}