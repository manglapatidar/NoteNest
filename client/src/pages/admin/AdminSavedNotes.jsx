import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/AdminSidebar';
import NoteCard from '../../components/NoteCard';
import Loader from '../../components/Loader';
import { getSavedNotes } from '../../features/profile/profileSlice';
import { Search, Heart, Bookmark } from 'lucide-react';

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
      <div className="md:ml-72 px-6 lg:px-10 py-10 flex-1 max-w-full overflow-hidden">
        
        {/* Header Section */}
        <div className="opacity-0 animate-fade-up mb-8" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F5F5]">Knowledge Vault</h1>
          <p className="text-[#52525B] text-sm mt-1">Review all content you've bookmarked for later.</p>
        </div>

        {/* Stats Card */}
        <div className="opacity-0 animate-fade-up mb-8 flex flex-wrap gap-4" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <div className="bg-[#0F1012] border border-[#1F2023] rounded-2xl p-5 flex items-center gap-4 min-w-[200px] group hover:border-[#00C896]/20 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-[#00C896]/10 text-[#00C896] flex items-center justify-center transition-transform group-hover:scale-110 shadow-[0_0_20px_rgba(0,200,150,0.1)]">
              <Heart size={20} fill="currentColor" className="opacity-80" />
            </div>
            <div>
              <div className="text-[#52525B] text-[10px] font-bold uppercase tracking-wider">Saved Content</div>
              <div className="text-[#00C896] text-2xl font-bold font-display tracking-tight">
                {isLoading ? '…' : savedNotes.length}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Area */}
        <div className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl overflow-hidden mb-8 shadow-xl shadow-black/10" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
          <div className="px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-base font-bold text-[#F5F5F5]">Collection</h3>
              <span className="bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/20 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                {filteredNotes.length} item(s)
              </span>
            </div>
            
            <div className="relative group w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B] group-focus-within:text-[#00C896] transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search vault..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#161719] border border-[#1F2023] rounded-xl pl-10 pr-4 py-2 text-sm text-[#F5F5F5] placeholder-[#52525B] outline-none focus:border-[#00C896]/50 transition-all w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          {isLoading ? (
             <div className="py-20 flex flex-col items-center justify-center gap-4">
               <Loader fullScreen={false} />
               <span className="text-[#52525B] text-sm font-medium animate-pulse">Syncing library...</span>
             </div>
          ) : filteredNotes.length === 0 ? (
            <div className="bg-[#0F1012] border border-[#1F2023] rounded-2xl py-24 text-center px-6">
              <div className="w-16 h-16 bg-[#161719] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#52525B]/40">
                <Bookmark size={32} />
              </div>
              <h4 className="text-[#F5F5F5] font-bold mb-2">Vault is empty</h4>
              <p className="text-[#52525B] text-sm max-w-xs mx-auto">All notes and PDFs you bookmark while browsing will be securely stored here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
              {filteredNotes.map((note, index) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  index={index}
                  showDelete={false}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
