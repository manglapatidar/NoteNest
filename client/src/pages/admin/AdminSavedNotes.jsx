import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AdminSidebar } from './AdminDashboard';
import NoteCard from '../../components/NoteCard';
import Loader from '../../components/Loader';
import { getSavedNotes } from '../../features/profile/profileSlice';

export default function AdminSavedNotes() {
  const dispatch = useDispatch();
  const { savedNotes, isLoading, isError, message } = useSelector((state) => state.profile);

  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(getSavedNotes());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  // Filter notes by search query
  const filteredNotes = savedNotes.filter((note) =>
    search === '' || note.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#08090A] flex pt-16">
      <AdminSidebar />
      
      <div className="md:ml-56 px-6 py-8 flex-1">
        
        {/* Header Section */}
        <div className="opacity-0 animate-fade-up mb-8" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <h1 className="font-display text-2xl font-bold text-[#F5F5F5]">Saved Notes</h1>
          <p className="text-[#52525B] text-sm mt-1">View all notes and PDFs you have saved.</p>
        </div>

        {/* Stats Card */}
        <div className="opacity-0 animate-fade-up mb-6" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <div className="bg-[#0F1012] border border-[#1F2023] rounded-2xl p-5 inline-flex items-center gap-4 hover:-translate-y-1 hover:border-[#00C896]/20 transition-all duration-300">
            <div className="w-8 h-8 rounded-lg bg-[#00C896]/10 text-[#00C896] flex items-center justify-center text-sm shadow-[0_0_10px_rgba(0,200,150,0.15)]">♥</div>
            <div>
              <div className="text-[#52525B] text-xs font-semibold uppercase tracking-widest">Total Saved</div>
              <div className="text-[#00C896] text-2xl font-bold font-display">
                {isLoading ? '…' : savedNotes.length}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Area */}
        <div className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl overflow-hidden mb-6" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
          <div className="px-6 py-4 flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-base font-bold text-[#F5F5F5]">My Library</h3>
              <span className="bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/20 rounded-full px-3 py-1 text-xs font-semibold">
                {filteredNotes.length} item(s)
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search your saved notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#161719] border border-[#1F2023] rounded-lg px-4 py-2 text-sm text-[#F5F5F5] placeholder-[#52525B] outline-none focus:border-[#00C896]/50 focus:ring-2 focus:ring-[#00C896]/10 transition-all w-64"
              />
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          {isLoading ? (
             <div className="py-20 flex items-center justify-center">
               <Loader fullScreen={false} />
             </div>
          ) : filteredNotes.length === 0 ? (
            <div className="col-span-3 bg-[#0F1012] border border-[#1F2023] rounded-2xl py-24 text-center">
              <div className="text-4xl mb-4 text-[#52525B]/40 animate-bounce">♥</div>
              <p className="text-[#52525B] text-sm">No saved notes found.</p>
              <p className="text-[#3A3A3F] text-xs mt-1">All content you save will appear right here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredNotes.map((note, index) => (
                <div 
                  key={note._id}
                  className="opacity-0 animate-fade-up hover:scale-[1.02] transform transition-transform duration-300" 
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <NoteCard
                    note={note}
                    index={index}
                    showDelete={false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
