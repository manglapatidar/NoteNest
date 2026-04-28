import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SubjectBadge from './SubjectBadge';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export default function NoteCard({ note, index = 0, showDelete = false, onDelete }) {
  const { user } = useSelector((state) => state.auth);

  // Check user already exists
  const userId = user?.id ?? user?._id;
  const alreadySaved = user
    ? note.saves?.some((id) => String(id).trim() === String(userId).trim())
    : false;

  // User ki existing rating 
  const existingRating = user
    ? (note.ratings?.find((r) => r.user?.toString() === String(userId))?.value ?? 0)
    : 0;

  const [saved, setSaved] = useState(alreadySaved);
  const [saveCount, setSaveCount] = useState(note.saves?.length || 0);
  const [userRating, setUserRating] = useState(existingRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [avgRating, setAvgRating] = useState(note.avgRating || 0);

  const starsArray = [1, 2, 3, 4, 5];

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return toast.error(' Login First');
    try {
      await axios.put(`${API_URL}/notes/save/${note._id}`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      const nowSaved = !saved;
      setSaved(nowSaved);
      setSaveCount((c) => nowSaved ? c + 1 : c - 1);
      toast.success(nowSaved ? 'Note saved to collection' : 'Note removed from collection');
    } catch {
      toast.error('Failed to save note');
    }
  };

  const handleRating = async (e, star) => {
    e.preventDefault();
    if (!user) return toast.error('Firstly login');
    if (userRating === star) return;
    try {
      const { data } = await axios.post(
        `${API_URL}/rating/`,
        { noteId: note._id, score: star },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setUserRating(star);
      if (data?.avgRating !== undefined) setAvgRating(parseFloat(data.avgRating));
      toast.success('Rating submitted!');
    } catch {
      toast.error('Failed to submit rating');
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`${API_URL}/notes/${note._id}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      toast.success('Note deleted');
      if (onDelete) onDelete(note._id);
    } catch {
      toast.error('Failed to delete note');
    }
  };

  const canDelete = showDelete && user && (
    String(userId) === note.user?._id?.toString() || user.role === 'admin'
  );

  const displayRating = hoverRating || userRating || Math.round(avgRating);

  return (
    <div
      className="opacity-0 animate-fade-up flex flex-col h-full"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
    >
      <Link to={`/notes/${note._id}`} className="block h-full group flex-1">
        <div className="bg-[#0F1012] border border-[#1F2023] rounded-2xl p-5 flex flex-col h-full hover:border-[#00C896]/30 hover:shadow-xl hover:shadow-[#00C896]/8 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">

          <div className="flex justify-between items-center">
            <SubjectBadge subject={note.subject?.name} />
            {note.status ? (
              <span className={`rounded-lg px-2 py-0.5 text-xs font-mono ml-2 ${
                note.status === 'approved' ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' :
                note.status === 'pending'  ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20' :
                'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20'
              }`}>
                {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
              </span>
            ) : null}
            <span className="bg-[#26282C] text-[#52525B] rounded-lg px-2 py-0.5 text-xs font-mono ml-auto">
              {note.fileUrl ? 'PDF' : 'TXT'}
            </span>
          </div>

          <h3 className="mt-3 font-display text-sm font-bold text-[#F5F5F5] line-clamp-2 group-hover:text-[#00C896] transition-colors duration-200">
            {note.title}
          </h3>

          <p className="mt-2 text-[#52525B] text-xs leading-relaxed line-clamp-2">
            {note.content}
          </p>

          {/* STARS */}
          <div className="mt-4 flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {starsArray.map((star) => (
                <button
                  key={star}
                  onClick={(e) => handleRating(e, star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none z-10 relative transition-transform hover:scale-125"
                >
                  <span className={`text-sm transition-colors duration-150 ${
                    star <= displayRating
                      ? userRating >= star
                        ? 'text-[#00C896]'
                        : 'text-[#F59E0B]'
                      : 'text-[#26282C]'
                  }`}>★</span>
                </button>
              ))}
            </div>
            <span className="text-[#A1A1AA] text-xs font-medium">{(+avgRating || 0).toFixed(1)}</span>
            <span className="text-[#26282C] text-xs">·</span>
            <span className="text-[#52525B] text-xs">{saveCount} saves</span>
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#00C896]/10 text-[#00C896] text-xs font-bold flex items-center justify-center">
                {note.user?.name?.[0] || 'A'}
              </div>
              <span className="text-[#52525B] text-xs">
                {note.user?.name
                  ? note.user.name.split(' ').filter(Boolean).map((n, i) => i === 0 ? n : (n[0] ?? '')).join(' ').trim()
                  : 'Unknown'}
              </span>
            </div>

            {/* HEART */}
            <button
              onClick={handleSave}
              className="focus:outline-none z-10 relative transition-transform hover:scale-125 active:scale-95"
            >
              {saved
                ? <span className="text-[#00C896] text-base">♥</span>
                : <span className="text-[#52525B] hover:text-[#00C896] text-base transition-colors">♡</span>
              }
            </button>
          </div>

        </div>
      </Link>

      {canDelete && (
        <button
          onClick={handleDelete}
          className="mt-2 text-center text-[#52525B] hover:text-[#EF4444] text-xs transition-colors"
        >
          Delete
        </button>
      )}
    </div>
  );
}