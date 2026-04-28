import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import SubjectBadge from '../components/SubjectBadge';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getNoteById, toggleSaveNote, deleteNote, clearNote } from '../features/notes/noteSlice';
import { getComments, postComment, deleteComment, resetComments } from '../features/comments/commentSlice';
import { rateNote } from '../features/rating/ratingSlice';
import Loader from '../components/Loader';
import { Search, Plus, Filter, ChevronDown, Check, LayoutGrid, BookOpen, Clock, Star, Heart, Zap, FileText, Trash2, Eye } from 'lucide-react';

const API_URL = '/api';

export default function NoteDetailPage() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { note, isLoading: noteLoading } = useSelector((state) => state.notes);
  const { comments } = useSelector((state) => state.comments);

  const [saved, setSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    subject: '',
    file: null,
  });

  useEffect(() => {
    dispatch(getNoteById(noteId));
    dispatch(getComments(noteId));
    
    return () => {
      dispatch(clearNote());
      dispatch(resetComments());
    };
  }, [noteId, dispatch]);

  useEffect(() => {
    if (note && user) {
      const userId = user?.id ?? user?._id;

      const isSaved = note.saves?.some(
        (id) => String(id).trim() === String(userId).trim()
      ) || false;
      setSaved(isSaved);

      const existing = note.ratings?.find(
        (r) => r.user?.toString() === String(userId)
      )?.value ?? 0;
      setUserRating(existing);

      setAvgRating(parseFloat(note.avgRating) || 0);

      setEditForm({
        title: note.title || '',
        content: note.content || '',
        subject: note.subject?._id || '',
        file: null,
      });
    }
  }, [note, user]);

  useEffect(() => {
    if (showEdit && subjects.length === 0) {
      axios.get(`${API_URL}/subjects`).then(({ data }) => setSubjects(data)).catch(() => {});
    }
  }, [showEdit]);

  const handleSave = () => {
    if (!user) return toast.error('Please login first');
    dispatch(toggleSaveNote(noteId))
      .unwrap()
      .then(() => {
        setSaved((prev) => !prev);
        toast.success(saved ? 'Note unsaved' : 'Note saved to collection');
      })
      .catch(() => toast.error('Failed to save note'));
  };

  const handleDeleteNote = () => {
    dispatch(deleteNote(noteId))
      .unwrap()
      .then(() => {
        toast.success('Note deleted');
        navigate('/browse');
      })
      .catch(() => toast.error('Failed to delete note'));
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return toast.error('Please enter a comment');
    dispatch(postComment({ noteId, text: commentText }))
      .unwrap()
      .then(() => {
        setCommentText('');
        toast.success('Comment posted!');
      })
      .catch(() => toast.error('Failed to post comment'));
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId))
      .unwrap()
      .then(() => toast.success('Comment deleted'))
      .catch(() => toast.error('Failed to delete comment'));
  };

  const handleRate = (rating) => {
    if (!user) return toast.error('Please login first');
    if (userRating === rating) return;
    dispatch(rateNote({ noteId, rating }))
      .unwrap()
      .then((data) => {
        setUserRating(rating);
        if (data?.avgRating !== undefined) setAvgRating(parseFloat(data.avgRating) || 0);
        toast.success('Rating submitted!');
      })
      .catch(() => toast.error('Failed to submit rating'));
  };

  const handleSummarize = async () => {
    if (showSummary) { setShowSummary(false); return; }
    
    if (!note?.content && !note?.fileUrl) return toast.error('This note has no content to summarize');
    
    if (!note?._id) return toast.error('Note ID not found. Please refresh.');
    
    setSummaryLoading(true);  
    try {
      console.log("Requesting summary for noteId:", note._id);
      let requestData = { noteId: note._id };

      if (note.fileUrl) {
        // PDF fallback logic (User prefers base64)
        try {
          const fileUrl = note.fileUrl.startsWith('http') ? note.fileUrl : window.location.origin + note.fileUrl;
          const fileRes = await fetch(fileUrl);
          if (fileRes.ok) {
            const blob = await fileRes.blob();
            const base64 = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result.split(',')[1]);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            requestData.pdfBase64 = base64;
            requestData.mimeType = 'application/pdf';
          }
        } catch (pdfErr) {
          console.warn("Base64 pre-processing failed, server will try disk instead:", pdfErr);
        }
      } else {
        requestData.content = note.content;
      }

      const { data } = await axios.post(
        `${API_URL}/notes/summarize`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`
          },
          timeout: 60000 // 60 seconds timeout for AI
        }
      );
      
      if (!data.summary || data.summary.length === 0) {
        throw new Error("AI returned an empty summary. Please try again.");
      }

      setSummary(data.summary);
      setShowSummary(true);
      toast.success('Summary generated!');
    } catch (err) {
      console.error("Summary error:", err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      toast.error(`Summary failed: ${errorMessage}`);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editForm.title.trim()) return toast.error('Title is required');
    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', editForm.title.trim());
      formData.append('content', editForm.content);
      if (editForm.subject) formData.append('subject', editForm.subject);
      if (editForm.file) formData.append('file', editForm.file);

      await axios.patch(`${API_URL}/notes/${noteId}`, formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Note updated! It will be visible after admin approval.');
      setShowEdit(false);
      dispatch(getNoteById(noteId));
    } catch {
      toast.error('Failed to update note');
    } finally {
      setEditLoading(false);
    }
  };

  const canEdit = user && note && (
    String(user?.id ?? user?._id) === String(note.user?._id)
  );
  const canDelete = user && note && (
    String(user?.id ?? user?._id) === String(note.user?._id) || user.role === 'admin'
  );

  const starsArray = [1, 2, 3, 4, 5];
  const displayRating = hoverRating || userRating || Math.round(avgRating);

  if (noteLoading || !note) return <Loader fullScreen={true} text="Loading Note..." />;

  return (
    <div className="min-h-screen bg-[#08090A] pt-16">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* BREADCRUMB */}
        <div className="opacity-0 animate-fade-right flex items-center gap-2 text-[#52525B] text-xs mb-6" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <Link to="/browse" className="hover:text-[#A1A1AA] transition-colors">Browse</Link>
          <span>/</span>
          <span className="hover:text-[#A1A1AA] transition-colors">{note.subject?.name}</span>
          <span>/</span>
          <span className="truncate">{note.title}</span>
        </div>

        {/* NOTE HEADER */}
        <div className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl p-6" style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-2 flex-wrap">
            <SubjectBadge subject={note.subject?.name} />
            <span className="bg-[#26282C] text-[#52525B] rounded-lg px-2 py-0.5 text-xs font-mono">
              {note.fileUrl ? 'PDF' : 'TXT'}
            </span>
            <span className="ml-auto text-[#52525B] text-xs">◉ {note.saves?.length || 0} saves</span>
          </div>

          <h1 className="mt-3 font-display text-3xl font-bold text-[#F5F5F5] leading-snug">{note.title}</h1>

          <div className="mt-3 flex items-center gap-4 text-xs text-[#52525B]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#00C896]/10 text-[#00C896] font-bold flex items-center justify-center">
                {note.user?.name?.[0]}
              </div>
              <span>{note.user?.name}</span>
            </div>
            <span>·</span>
            <span>{new Date(note.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>·</span>
            <span className="text-[#F59E0B] font-medium">★ {(+avgRating || 0).toFixed(1)}</span>
          </div>

          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <button
              onClick={handleSave}
              className="bg-transparent border border-[#1F2023] hover:border-[#00C896]/50 text-[#A1A1AA] hover:text-[#F5F5F5] text-sm font-medium rounded-xl px-4 py-2 hover:scale-[1.02] transition-all duration-200"
            >
              {saved
                ? <span className="text-[#00C896]">♥ Saved</span>
                : <span>♡ Save Note</span>
              }
            </button>

            <button
              onClick={handleSummarize}
              disabled={summaryLoading}
              className={`
                relative overflow-hidden group
                ${summaryLoading ? 'bg-[#00C896]/50' : 'bg-[#00C896] hover:bg-[#00E5B0]'} 
                text-[#08090A] font-bold text-sm rounded-xl px-6 py-2.5 
                hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]
                flex items-center justify-center gap-2 transition-all duration-300 min-w-[200px]
                shadow-lg shadow-[#00C896]/20 hover:shadow-[#00C896]/40
              `}
            >
              {summaryLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#08090A] border-t-transparent rounded-full animate-spin"></div>
                  <span className="animate-pulse">Analyzing Content...</span>
                </>
              ) : (
                <>
                  <Zap size={16} className={`transition-transform duration-500 ${showSummary ? 'rotate-180 text-[#08090A]/70' : 'group-hover:scale-125'}`} />
                  <span>{showSummary ? 'Hide Analysis' : 'Generate AI Summary'}</span>
                </>
              )}
            </button>

            {canEdit && (
              <button
                onClick={() => setShowEdit(true)}
                className="bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 hover:bg-[#3B82F6] hover:text-white text-sm font-medium rounded-xl px-4 py-2 transition-all duration-200"
              >
                ✎ Edit Note
              </button>
            )}

            {canDelete && (
              <button
                onClick={handleDeleteNote}
                className="bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444] hover:text-white text-sm font-medium rounded-xl px-4 py-2 transition-all duration-200"
              >
                Delete Note
              </button>
            )}
          </div>
        </div>

        {/* EDIT MODAL */}
        {showEdit && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4" onClick={() => setShowEdit(false)}>
            <div
              className="bg-[#0F1012] border border-[#1F2023] rounded-2xl p-6 w-full max-w-lg animate-fade-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-base font-bold text-[#F5F5F5]">Edit Note</h2>
                <button onClick={() => setShowEdit(false)} className="text-[#52525B] hover:text-[#F5F5F5] text-lg transition-colors">✕</button>
              </div>

              <div className="mb-4">
                <label className="text-[#52525B] text-xs font-semibold uppercase tracking-widest mb-2 block">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-[#161719] border border-[#1F2023] rounded-xl px-4 py-2.5 text-[#F5F5F5] text-sm placeholder-[#52525B] focus:outline-none focus:border-[#00C896] transition-all"
                  placeholder="Enter note title..."
                />
              </div>

              <div className="mb-4">
                <label className="text-[#52525B] text-xs font-semibold uppercase tracking-widest mb-2 block">Subject</label>
                <select
                  value={editForm.subject}
                  onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                  className="w-full bg-[#161719] border border-[#1F2023] rounded-xl px-4 py-2.5 text-[#F5F5F5] text-sm focus:outline-none focus:border-[#00C896] transition-all appearance-none"
                >
                  <option value="">Select a subject</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {!note.fileUrl && (
                <div className="mb-4">
                  <label className="text-[#52525B] text-xs font-semibold uppercase tracking-widest mb-2 block">Content</label>
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    rows={5}
                    className="w-full bg-[#161719] border border-[#1F2023] rounded-xl px-4 py-2.5 text-[#F5F5F5] text-sm placeholder-[#52525B] focus:outline-none focus:border-[#00C896] transition-all resize-none"
                    placeholder="Enter note content..."
                  />
                </div>
              )}

              {note.fileUrl && (
                <div className="mb-4">
                  <label className="text-[#52525B] text-xs font-semibold uppercase tracking-widest mb-2 block">Replace PDF (optional)</label>
                  <div className="bg-[#161719] border border-[#1F2023] rounded-xl px-4 py-2.5">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setEditForm({ ...editForm, file: e.target.files[0] })}
                      className="text-[#A1A1AA] text-sm w-full file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#00C896]/10 file:text-[#00C896] file:text-xs file:font-semibold hover:file:bg-[#00C896]/20 file:cursor-pointer"
                    />
                    {editForm.file && (
                      <p className="text-[#00C896] text-xs mt-1">✓ {editForm.file.name}</p>
                    )}
                  </div>
                  <p className="text-[#52525B] text-xs mt-1">Leave empty to keep existing PDF</p>
                </div>
              )}

              <div className="bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-xl px-4 py-3 mb-5">
                <p className="text-[#F59E0B] text-xs">⚠ After updating, your note will be pending — admin re-approval required</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEdit(false)}
                  className="flex-1 bg-[#161719] border border-[#1F2023] text-[#A1A1AA] hover:text-[#F5F5F5] text-sm font-medium rounded-xl py-2.5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  disabled={editLoading}
                  className="flex-1 bg-[#00C896] hover:bg-[#00A87E] disabled:opacity-60 text-[#08090A] font-semibold text-sm rounded-xl py-2.5 transition-all"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI SUMMARY */}
        {showSummary && (
          <div className="animate-scale-in mt-5 bg-[#00C896]/5 border border-[#00C896]/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#00C896]">✦</span>
              <span className="font-display text-sm font-bold text-[#00C896]">AI Summary</span>
              <span className="ml-auto bg-[#161719] border border-[#1F2023] rounded-full px-2 py-0.5 text-[10px] text-[#52525B] uppercase tracking-wider font-semibold">Powered by Gemini</span>
            </div>
            <div className="space-y-3">
              {summary.map((point, i) => (
                <div key={i} className="opacity-0 animate-fade-right flex items-start gap-3" style={{ animationDelay: `${100 + i * 100}ms`, animationFillMode: 'forwards' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00C896] mt-1.5 flex-shrink-0"></div>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NOTE CONTENT */}
        <div className="opacity-0 animate-fade-up mt-6 bg-[#0F1012] border border-[#1F2023] rounded-2xl p-6" style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}>
          <h2 className="font-display text-sm font-bold text-[#52525B] uppercase tracking-widest mb-4">Note Content</h2>
          {note.fileUrl ? (
            <a
              href={note.fileUrl}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#161719] border border-[#1F2023] text-[#00C896] rounded-xl px-4 py-2 text-sm hover:border-[#00C896]/50 transition-all"
            >
              📄 View PDF
            </a>
          ) : (
            <p className="text-[#A1A1AA] text-sm leading-8 whitespace-pre-wrap">{note.content}</p>
          )}
        </div>

        {/* RATING */}
        <div className="opacity-0 animate-fade-up mt-6 bg-[#0F1012] border border-[#1F2023] rounded-2xl p-6" style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-display text-base font-bold text-[#F5F5F5]">Rate this Note</h2>
              {userRating > 0 && (
                <p className="text-[#00C896] text-xs mt-1">You rated this {userRating}/5</p>
              )}
            </div>
            <div>
              <span className="font-display text-3xl font-bold text-[#F5F5F5]">{(+avgRating || 0).toFixed(1)}</span>
              <span className="text-[#52525B] text-lg">/5</span>
            </div>
          </div>

          <div className="flex gap-2">
            {starsArray.map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-125 active:scale-95"
              >
                <span className={`text-3xl transition-colors duration-150 ${
                  star <= displayRating
                    ? userRating >= star ? 'text-[#00C896]' : 'text-[#F59E0B]'
                    : 'text-[#26282C]'
                }`}>★</span>
              </button>
            ))}
          </div>
        </div>

        {/* COMMENTS */}
        <div className="opacity-0 animate-fade-up mt-6" style={{ animationDelay: '450ms', animationFillMode: 'forwards' }}>
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-display text-base font-bold text-[#F5F5F5]">Discussion</h2>
            <span className="bg-[#161719] border border-[#1F2023] rounded-full px-3 py-1 text-[#A1A1AA] text-xs">
              {comments.length} comments
            </span>
          </div>

          <div className="bg-[#0F1012] border border-[#1F2023] rounded-2xl p-5 mb-5 flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-[#00C896]/10 text-[#00C896] text-xs font-bold flex items-center justify-center flex-shrink-0">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1">
              <textarea
                placeholder="Ask a question or share your thoughts..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-[#161719] border border-[#1F2023] rounded-xl px-4 py-3 text-[#F5F5F5] text-sm placeholder-[#52525B] focus:outline-none focus:border-[#00C896] focus:ring-1 focus:ring-[#00C896]/20 transition-all duration-200 resize-none h-20 mb-3"
              />
              <div className="text-right">
                <button
                  onClick={handlePostComment}
                  className="bg-[#00C896] hover:bg-[#00A87E] text-[#08090A] font-semibold text-sm rounded-xl px-5 py-2 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {comments.map((comment, i) => (
              <div
                key={comment._id}
                className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl p-5"
                style={{ animationDelay: `${500 + i * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#00C896]/10 text-[#00C896] text-[10px] font-bold flex items-center justify-center">
                    {comment.userId?.name?.[0]}
                  </div>
                  <span className="text-[#F5F5F5] text-sm font-semibold">{comment.userId?.name}</span>
                  <span className="ml-auto text-[#52525B] text-xs">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-2 text-[#A1A1AA] text-sm">{comment.text}</p>
                {user && (
                  String(user?.id ?? user?._id) === String(comment.userId?._id) ||
                  user.role === 'admin'
                ) && (
                  <div
                    onClick={() => handleDeleteComment(comment._id)}
                    className="mt-2 text-[#52525B] hover:text-[#EF4444] text-xs transition-colors cursor-pointer w-max"
                  >
                    Delete
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}