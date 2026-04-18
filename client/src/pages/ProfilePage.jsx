import React, { useState, useEffect } from 'react';
import NoteCard from '../components/NoteCard';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getMyNotes, getSavedNotes, removeFromMyNotes } from '../features/profile/profileSlice';
import { deleteNote } from '../features/notes/noteSlice';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('uploads');
  const [showAll, setShowAll] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { myNotes, savedNotes, isLoading } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getMyNotes());
    dispatch(getSavedNotes());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(removeFromMyNotes(id));
  };

  // Member since
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  // Days since joined
  const daysSince = user?.createdAt
    ? Math.floor((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))
    : null;

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const activeNotes = activeTab === 'uploads' ? myNotes : savedNotes;

  return (
    <div className="min-h-screen bg-[#08090A] pt-16">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* PROFILE HEADER */}
        <div
          className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl p-6 mb-8"
          style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">

            {/* Avatar + Info */}
            <div className="flex items-center gap-5">
              {/* Animated avatar */}
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl border border-[#00C896]/30 animate-ping opacity-40" />
                <div className="w-16 h-16 rounded-2xl bg-[#00C896]/10 border border-[#00C896]/25 flex items-center justify-center font-display text-2xl font-bold text-[#00C896] hover:scale-105 hover:border-[#00C896]/50 transition-all duration-300 relative">
                  {initials}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-2xl font-bold text-[#F5F5F5]">{user?.name}</h1>
                  {user?.role === 'admin' && (
                    <span className="bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/20 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-[#52525B] text-sm mt-0.5">{user?.email}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <p className="text-[#52525B] text-xs">
                    {memberSince ? `Joined ${memberSince}` : 'Welcome to NoteNest!'}
                  </p>
                </div>
                {daysSince !== null && (
                  <p className="text-[#3A3A3F] text-xs mt-0.5 pl-3">
                    {daysSince === 0
                      ? 'Joined today!'
                      : daysSince < 30
                      ? `${daysSince} days on NoteNest`
                      : daysSince < 365
                      ? `${Math.floor(daysSince / 30)} months on NoteNest`
                      : `${Math.floor(daysSince / 365)} year${Math.floor(daysSince / 365) > 1 ? 's' : ''} on NoteNest`
                    }
                  </p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="md:ml-auto flex gap-3 w-full md:w-auto">
              {[
                { num: isLoading ? '…' : myNotes.length,    label: 'Uploads', icon: '◉', delay: '200ms' },
                { num: isLoading ? '…' : savedNotes.length, label: 'Saved',   icon: '♥', delay: '300ms' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex-1 opacity-0 animate-fade-left bg-[#161719] border border-[#1F2023] rounded-xl px-5 py-3 text-center hover:-translate-y-1 hover:border-[#00C896]/20 hover:shadow-lg hover:shadow-[#00C896]/5 transition-all duration-300 cursor-default"
                  style={{ animationDelay: stat.delay, animationFillMode: 'forwards' }}
                >
                  <div className="text-[#00C896] text-xs mb-1">{stat.icon}</div>
                  <div className="font-display text-2xl font-bold text-[#F5F5F5]">{stat.num}</div>
                  <div className="text-[#52525B] text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom divider line */}
          <div className="mt-5 h-px bg-gradient-to-r from-[#00C896]/20 via-[#00C896]/5 to-transparent" />
        </div>

        {/* TABS */}
        <div
          className="opacity-0 animate-fade-up flex border-b border-[#1F2023] mb-6"
          style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
        >
          {[
            { key: 'uploads', label: 'My Uploads',   count: myNotes.length },
            { key: 'saved',   label: 'Saved Notes',  count: savedNotes.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-1 mr-6 text-sm font-semibold transition-all duration-200 focus:outline-none flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'text-[#F5F5F5] border-b-2 border-[#00C896]'
                  : 'text-[#52525B] hover:text-[#A1A1AA]'
              }`}
            >
              {tab.label}
              {!isLoading && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab.key
                    ? 'bg-[#00C896]/15 text-[#00C896]'
                    : 'bg-[#161719] text-[#52525B]'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* NOTES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
          {isLoading ? (
            // Skeleton loader
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-[#0F1012] border border-[#1F2023] rounded-2xl p-5 h-48 animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="h-3 bg-[#1F2023] rounded w-1/3 mb-3" />
                <div className="h-4 bg-[#1F2023] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[#1F2023] rounded w-full mb-1" />
                <div className="h-3 bg-[#1F2023] rounded w-2/3" />
              </div>
            ))
          ) : activeNotes.length === 0 ? (
            <div className="col-span-3 py-20 text-center opacity-0 animate-fade-up" style={{ animationFillMode: 'forwards' }}>
              <div className="text-4xl mb-3">{activeTab === 'uploads' ? '◉' : '♡'}</div>
              <p className="text-[#52525B] text-sm">
                {activeTab === 'uploads' ? 'No uploads yet' : 'No saved notes yet'}
              </p>
              <p className="text-[#3A3A3F] text-xs mt-1">
                {activeTab === 'uploads' ? 'Upload your first note to get started' : 'Browse and save notes you like'}
              </p>
            </div>
          ) : (
            activeNotes.map((note, index) => (
              <NoteCard
                key={note._id}
                note={note}
                index={index}
                showDelete={activeTab === 'uploads'}
                onDelete={activeTab === 'uploads' ? handleDelete : undefined}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
}