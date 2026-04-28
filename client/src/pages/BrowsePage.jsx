import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Search, Plus, Filter, ChevronDown, Check, LayoutGrid, BookOpen, Clock, Star, Heart } from 'lucide-react';

const API_URL = '/api';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First', icon: <Clock size={14} /> },
  { value: 'rating', label: 'Top Rated',    icon: <Star size={14} /> },
  { value: 'saves',  label: 'Most Saved',   icon: <Heart size={14} /> },
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
    <div className="min-h-screen bg-[#08090A] pt-16 sm:pt-20">

      {/* TOP BAR */}
      <div className="relative z-40 bg-[#0F1012] border-b border-[#1F2023] px-4 sm:px-6 py-5 opacity-0 animate-fade-down" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-[#F5F5F5] flex items-center gap-2">
                <LayoutGrid className="text-[#00C896]" size={20} />
                Browse Notes
              </h1>
              <p className="text-[#52525B] text-xs font-medium mt-0.5">Explore high-quality study materials shared by the community.</p>
            </div>

            {user?.role !== 'admin' && (
              <Link
                to="/upload"
                className="w-full sm:w-auto bg-[#00C896] hover:bg-[#00E5B0] text-[#08090A] font-bold text-sm rounded-xl px-6 py-3 flex items-center justify-center gap-2 shadow-lg shadow-[#00C896]/10 hover:shadow-[#00C896]/20 transition-all duration-200"
              >
                <Plus size={18} />
                Upload a Note
              </Link>
            )}
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Subject buttons (Scrollable on mobile) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              <button
                onClick={() => setActiveSubject('All')}
                className={`flex-shrink-0 rounded-full px-5 py-2 text-xs font-bold transition-all uppercase tracking-wider ${
                  activeSubject === 'All'
                    ? 'bg-[#00C896] text-[#08090A]'
                    : 'bg-[#161719] border border-[#1F2023] text-[#52525B] hover:border-[#00C896]/40 hover:text-[#F5F5F5]'
                }`}
              >
                All Categories
              </button>

              {subjects.map((sub) => (
                <button
                  key={sub._id}
                  onClick={() => setActiveSubject(sub.name)}
                  className={`flex-shrink-0 rounded-full px-5 py-2 text-xs font-bold transition-all uppercase tracking-wider ${
                    activeSubject === sub.name
                      ? 'bg-[#00C896] text-[#08090A]'
                      : 'bg-[#161719] border border-[#1F2023] text-[#52525B] hover:border-[#00C896]/40 hover:text-[#F5F5F5]'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>

            {/* CUSTOM SORT DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setSortOpen((p) => !p)}
                className={`w-full md:w-auto flex items-center gap-3 bg-[#161719] border rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 justify-between md:justify-start min-w-[180px] ${
                  sortOpen
                    ? 'border-[#00C896]/60 text-[#F5F5F5]'
                    : 'border-[#1F2023] text-[#52525B] hover:border-[#00C896]/40 hover:text-[#F5F5F5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[#00C896]">{activeSort.icon}</span>
                  <span className="uppercase text-[10px] tracking-widest">{activeSort.label}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${sortOpen ? 'rotate-180 text-[#00C896]' : ''}`} />
              </button>

              {/* Dropdown panel */}
              {sortOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-full md:w-56 bg-[#0F1012] border border-[#1F2023] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 z-50 animate-fade-up-small">
                  <div className="px-4 py-3 border-b border-[#1F2023] bg-[#161719]/50">
                    <span className="text-[10px] font-bold text-[#52525B] uppercase tracking-[0.2em]">Sort Library By</span>
                  </div>
                  {SORT_OPTIONS.map((opt, i) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold transition-all duration-150 text-left border-t border-[#1F2023]
                        ${sortBy === opt.value
                          ? 'bg-[#00C896]/5 text-[#00C896]'
                          : 'text-[#52525B] hover:bg-[#161719] hover:text-[#F5F5F5]'
                        }
                      `}
                    >
                      <span className={`${sortBy === opt.value ? 'text-[#00C896]' : 'text-[#3A3A3F]'}`}>
                        {opt.icon}
                      </span>
                      <span className="uppercase tracking-widest flex-1">{opt.label}</span>
                      {sortBy === opt.value && (
                        <Check size={14} className="text-[#00C896]" />
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNotes.map((note, index) => (
            <NoteCard key={note._id} note={note} index={index} />
          ))}
          {filteredNotes.length === 0 && (
            <div className="col-span-full py-32 text-center">
              <div className="w-20 h-20 bg-[#161719] rounded-3xl flex items-center justify-center mx-auto mb-6 text-[#52525B]/20">
                <BookOpen size={40} />
              </div>
              <h3 className="text-[#F5F5F5] font-bold text-lg">No notes found</h3>
              <p className="text-[#52525B] text-sm mt-1 max-w-xs mx-auto">We couldn't find any notes matching this category. Try exploring other subjects!</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}