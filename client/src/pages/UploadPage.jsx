import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';

const UploadPage = () => {
  const [type, setType] = useState('text');
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    content: ""
  });

  const { user } = useSelector((state) => state.auth);

  // Fetch subjects — no token needed (public route)
  const fetchSubjects = async () => {
    try {
      const { data } = await axios.get('/api/subjects');
      setSubjects(data);
    } catch (error) {
      toast.error('Failed to load subjects');
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject) return toast.error("Please select a subject");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("subject", formData.subject); 

      if (type === "text") {
        if (!formData.content.trim()) return toast.error("Please enter note content");
        data.append("content", formData.content);
      }

      if (type === "pdf") {
        if (!file) return toast.error("Please select a PDF file");
        data.append("file", file);
      }

      await axios.post('/api/notes', data, {
        headers: {
          Authorization: `Bearer ${user?.token}`,  
          "Content-Type": "multipart/form-data"
        }
      });

      setSubmitted(true);
      toast.success("Your note is submitted! It will go live after admin review. ⏳");

      // reset
      setFormData({ title: "", subject: "", content: "" });
      setFile(null);
      setFileName('');

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Upload Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#08090A] pt-16">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link to="/browse" className="opacity-0 animate-fade-right inline-block text-[#52525B] hover:text-[#A1A1AA] hover:-translate-x-1 transition-all text-sm mb-6" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          &larr; Browse
        </Link>
        <h1 className="opacity-0 animate-fade-up font-display text-3xl font-bold text-[#F5F5F5]" style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
          Upload a Note
        </h1>
        <p className="opacity-0 animate-fade-up text-[#A1A1AA] text-sm mt-1 mb-8" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          Share your knowledge with the community.
        </p>

        <form onSubmit={handleSubmit} className="opacity-0 animate-fade-up bg-[#0F1012] border border-[#1F2023] rounded-2xl p-8" style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}>

          {/* TITLE */}
          <div className="opacity-0 animate-fade-up mb-6" style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
            <label className="block text-[#52525B] text-xs font-semibold uppercase tracking-widest mb-2">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              type="text"
              placeholder="e.g. Complete Calculus Integration Notes"
              required
              className="w-full bg-[#161719] border border-[#1F2023] rounded-xl px-4 py-3 text-[#F5F5F5] text-sm placeholder-[#52525B] focus:outline-none focus:border-[#00C896] focus:ring-1 focus:ring-[#00C896]/20 transition-all duration-200"
            />
          </div>

          {/* SUBJECT */}
          <div className="opacity-0 animate-fade-up mb-6" style={{ animationDelay: '450ms', animationFillMode: 'forwards' }}>
            <label className="block text-[#52525B] text-xs font-semibold uppercase tracking-widest mb-2">Subject</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full bg-[#161719] border border-[#1F2023] rounded-xl px-4 py-3 text-[#A1A1AA] text-sm appearance-none focus:outline-none focus:border-[#00C896] focus:ring-1 focus:ring-[#00C896]/20 transition-all duration-200"
            >
              <option value="" disabled>Select a subject</option>
              {subjects.map((sub) => (
                // value mein sub._id — backend ObjectId expect karta hai
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
          </div>

          {/* CONTENT TYPE */}
          <div className="opacity-0 animate-fade-up mb-6" style={{ animationDelay: '550ms', animationFillMode: 'forwards' }}>
            <label className="block text-[#52525B] text-xs font-semibold uppercase tracking-widest mb-2">Content Type</label>
            <div className="flex gap-1 bg-[#161719] rounded-xl p-1 w-fit">
              <button type="button" onClick={() => setType('text')} className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${type === 'text' ? 'bg-[#0F1012] border border-[#1F2023] text-[#F5F5F5] shadow-sm' : 'text-[#52525B] hover:text-[#A1A1AA]'}`}>
                Text
              </button>
              <button type="button" onClick={() => setType('pdf')} className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${type === 'pdf' ? 'bg-[#0F1012] border border-[#1F2023] text-[#F5F5F5] shadow-sm' : 'text-[#52525B] hover:text-[#A1A1AA]'}`}>
                PDF File
              </button>
            </div>
          </div>

          {/* TEXT or PDF */}
          <div className="opacity-0 animate-fade-up" style={{ animationDelay: '650ms', animationFillMode: 'forwards' }}>
            {type === 'text' ? (
              <div>
                <label className="block text-[#52525B] text-xs font-semibold uppercase tracking-widest mb-2">Note Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write or paste your notes here..."
                  className="w-full bg-[#161719] border border-[#1F2023] rounded-xl px-4 py-3 text-[#F5F5F5] text-sm placeholder-[#52525B] focus:outline-none focus:border-[#00C896] focus:ring-1 focus:ring-[#00C896]/20 transition-all duration-200 h-52 resize-none"
                ></textarea>
                <div className="text-right mt-1 text-[#52525B] text-xs">{formData.content.length} characters</div>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept="application/pdf"
                  id="fileUpload"
                  className="hidden"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    setFileName(e.target.files[0]?.name);
                  }}
                />
                <div
                  onClick={() => document.getElementById("fileUpload").click()}
                  className="border-2 border-dashed border-[#1F2023] hover:border-[#00C896]/50 hover:bg-[#00C896]/5 rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer"
                >
                  <div className="w-12 h-12 mx-auto bg-[#161719] rounded-xl flex items-center justify-center mb-3 text-[#52525B] text-xl">↑</div>
                  {fileName ? (
                    <div className="text-[#00C896] text-sm font-medium">✔ {fileName}</div>
                  ) : (
                    <>
                      <div className="text-[#A1A1AA] text-sm">Drop your PDF here</div>
                      <div className="text-[#52525B] text-xs mt-1">or click to browse — max 10MB</div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* SUBMIT */}
          <div className="opacity-0 animate-fade-up mt-8" style={{ animationDelay: '750ms', animationFillMode: 'forwards' }}>
            <button type="submit" className="w-full bg-[#00C896] hover:bg-[#00A87E] text-[#08090A] font-semibold text-sm rounded-xl px-5 py-3 hover:scale-[1.01] transition-all duration-200 shadow-xl shadow-[#00C896]/10">
              Upload Note &rarr;
            </button>
            <div className="text-center text-[#52525B] text-xs mt-3">
              ⏳ Notes are reviewed before going live. Usually under 24 hours.
            </div>
          </div>

          {submitted && (
            <div className="mt-4 bg-[#00C896]/10 border border-[#00C896]/20 text-[#00C896] rounded-xl p-4 text-sm text-center animate-scale-in">
              ⏳ Note submitted! Pending admin review — usually approved within 24 hours.
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default UploadPage;