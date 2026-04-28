import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#08090A] overflow-x-hidden pt-16">
      {/* ━━━━━━━━━━ HERO SECTION ━━━━━━━━━━ */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative -mt-16 pt-16 pb-32">

        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(#1F2023_1px,transparent_1px),linear-gradient(90deg,#1F2023_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 animate-fade-in"></div>
          <div className="absolute top-0 left-1/4 w-[700px] h-[500px] bg-[#00C896]/15 rounded-full blur-[130px] animate-blob mix-blend-screen"></div>
          <div className="absolute top-20 right-1/4 w-[500px] h-[400px] bg-[#00E5B0]/10 rounded-full blur-[110px] animate-blob mix-blend-screen" style={{ animationDelay: '2000ms' }}></div>
          <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-[#008f6b]/15 rounded-full blur-[140px] animate-blob mix-blend-screen" style={{ animationDelay: '4000ms' }}></div>
          <div className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-[#00C896] animate-ping-slow opacity-60"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-[#00C896]/40 animate-ping-slow" style={{ animationDelay: '1000ms' }}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center">

          <div className="opacity-0 animate-fade-down inline-flex items-center gap-2 bg-[#00C896]/10 border border-[#00C896]/20 rounded-full px-4 py-1.5 mb-8" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#00C896] animate-ping-slow"></div>
            <span className="text-[#00C896] text-xs font-semibold">Study smarter, together</span>
          </div>

          <h1 className="opacity-0 animate-fade-up font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-[#F5F5F5] leading-tight max-w-4xl tracking-tight" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            The notes platform <br className="hidden sm:block" /> Built for <span className="bg-gradient-to-r from-[#00C896] via-[#00E5B0] to-[#00C896] bg-[length:200%_auto] bg-clip-text text-transparent animate-text-gradient">students.</span>
          </h1>

          <p className="opacity-0 animate-fade-up mt-6 text-[#A1A1AA] text-lg max-w-xl mx-auto leading-relaxed" style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
            Upload, discover, and master study notes shared by students worldwide. AI-powered summaries included.
          </p>

          <div className="opacity-0 animate-fade-up mt-10 flex flex-col sm:flex-row gap-3 justify-center" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
            <button onClick={() => navigate('/register')} className="relative group bg-[#00C896] text-[#08090A] font-bold rounded-xl px-8 py-3.5 text-base shadow-[0_0_40px_-10px_rgba(0,200,150,0.4)] hover:shadow-[0_0_60px_-15px_rgba(0,200,150,0.6)] hover:-translate-y-1 transition-all duration-300">
              <span className="relative z-10 flex items-center gap-2">Start Browsing Notes <span className="transition-transform group-hover:translate-x-1">&rarr;</span></span>
              <div className="absolute inset-0 bg-white/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button onClick={() => navigate('/register')} className="bg-transparent border border-[#1F2023] hover:border-[#00C896]/50 text-[#A1A1AA] hover:text-[#F5F5F5] font-medium rounded-xl px-7 py-3 text-base hover:-translate-y-0.5 transition-all duration-200 focus:outline-none">
              See how it works
            </button>
          </div>

          <div className="opacity-0 animate-fade-up mt-12 flex flex-wrap items-center justify-center gap-6 text-[#52525B] text-sm" style={{ animationDelay: '650ms', animationFillMode: 'forwards' }}>
            <span>&check; Free to use</span>
            <span>&check; AI summaries</span>
            <span>&check; No credit card</span>
          </div>

          {/* Browser Mockup */}
          <div className="opacity-0 animate-fade-up mt-16 w-full max-w-5xl mx-auto" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
            <div className="animate-float-alt rounded-2xl border border-[#1F2023] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_60px_rgba(0,200,150,0.1)] hover:border-[#00C896]/20 transition-all duration-700">
              <div className="bg-[#0F1012] px-4 py-3 border-b border-[#1F2023] flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                <div className="ml-4 bg-[#161719] rounded-lg px-3 py-1.5 text-[#52525B] text-xs w-full max-w-xs text-left">
                  notenest.app/browse
                </div>
              </div>
              <div className="bg-[#0F1012] p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="opacity-0 animate-scale-in bg-[#161719] border border-[#1F2023] rounded-xl p-5 text-left" style={{ animationDelay: `${900 + i * 100}ms`, animationFillMode: 'forwards' }}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-[#00C896]/10 text-[#00C896] rounded-full px-3 py-1 text-[10px] uppercase font-bold tracking-widest inline-block border border-[#00C896]/20">Subject</span>
                    </div>
                    <div className="h-4 bg-[#26282C] rounded-lg w-full mb-3"></div>
                    <div className="h-3 bg-[#1F2023] rounded w-full mb-2"></div>
                    <div className="h-3 bg-[#1F2023] rounded w-5/6 mb-2"></div>
                    <div className="h-3 bg-[#1F2023] rounded w-4/5 mb-4"></div>
                    <div className="flex gap-1 mt-auto pt-2">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className={`w-3 h-3 rounded ${j === 4 && i % 2 !== 0 ? 'bg-[#1F2023]' : 'bg-[#F59E0B]/80'}`}></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━ STATS STRIP ━━━━━━━━━━ */}
      <section className="py-12 border-y border-[#1F2023] bg-[#0F1012] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00C896]/5 to-transparent animate-shimmer bg-[length:200%_100%]"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: '10k+', label: 'Notes Uploaded', delay: '200ms' },
            { val: '5k+', label: 'Active Students', delay: '300ms' },
            { val: '50+', label: 'Subjects', delay: '400ms' },
            { val: '4.8★', label: 'Avg Rating', delay: '500ms' },
          ].map((stat, i) => (
            <div key={i} className={`opacity-0 animate-fade-up ${i !== 3 ? 'md:border-r border-[#1F2023]' : ''}`} style={{ animationDelay: stat.delay, animationFillMode: 'forwards' }}>
              <div className="font-display text-4xl font-bold text-[#F5F5F5] hover:text-[#00C896] transition-colors cursor-default">{stat.val}</div>
              <div className="text-[#52525B] text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━ FEATURES SECTION ━━━━━━━━━━ */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto text-center">
        <div className="opacity-0 animate-fade-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <div className="text-[#00C896] text-xs font-semibold uppercase tracking-widest mb-3">WHY NOTENEST</div>
          <h2 className="font-display text-4xl font-bold text-[#F5F5F5] mb-4">Everything you need to study better</h2>
          <p className="text-[#A1A1AA] max-w-2xl mx-auto">Discover features designed to help you organize, understand, and master your coursework faster than ever.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {[
            { icon: '↑', title: 'Upload Instantly', desc: 'Share notes as text or PDF. Admin reviews before going live.', delay: '100ms' },
            { icon: '✦', title: 'AI-Powered Summaries', desc: 'Claude AI distills any note into 5 crisp bullet points instantly.', delay: '200ms' },
            { icon: '◈', title: 'Browse by Subject', desc: 'Filter by subject, sort by rating, find what you need in seconds.', delay: '300ms' },
            { icon: '★', title: 'Community Ratings', desc: 'Rate notes 1–5 stars and comment. Best notes rise to the top.', delay: '400ms' },
            { icon: '◉', title: 'Personal Collection', desc: 'Save notes to your profile. Your study library, always ready.', delay: '500ms' },
            { icon: '⊞', title: 'Quality Controlled', desc: 'Every note reviewed by admins. No spam, no low-effort uploads.', delay: '600ms' },
          ].map((feat, i) => (
            <div key={i} className="opacity-0 animate-fade-up relative bg-[#0F1012] border border-[#1F2023] rounded-2xl p-6 group cursor-default hover:-translate-y-2 hover:bg-[#161719] hover:shadow-2xl hover:shadow-[#00C896]/10 transition-all duration-500 overflow-hidden" style={{ animationDelay: feat.delay, animationFillMode: 'forwards' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#00C896]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 w-12 h-12 rounded-xl bg-[#00C896]/10 border border-[#00C896]/20 flex items-center justify-center mb-5 text-[#00C896] text-xl group-hover:scale-110 group-hover:bg-[#00C896] group-hover:text-[#08090A] group-hover:shadow-[0_0_20px_rgba(0,200,150,0.4)] transition-all duration-300">
                {feat.icon}
              </div>
              <h3 className="relative z-10 font-display text-xl font-bold text-[#F5F5F5] mb-3 group-hover:text-[#00C896] transition-colors">{feat.title}</h3>
              <p className="text-[#A1A1AA] text-sm leading-relaxed">{feat.desc}</p>
              <div className="mt-4 h-px w-0 group-hover:w-full bg-gradient-to-r from-[#00C896]/60 to-transparent transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━ HOW IT WORKS ━━━━━━━━━━ */}
      <section id="how-it-works" className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center opacity-0 animate-fade-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <div className="text-[#00C896] text-xs font-semibold uppercase tracking-widest mb-3">PROCESS</div>
          <h2 className="font-display text-4xl font-bold text-[#F5F5F5] mb-4">Simple. Fast. Effective.</h2>
        </div>

        <div className="mt-12 relative grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="absolute top-6 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[#1F2023] to-transparent hidden md:block"></div>

          {[
            { num: '1', title: 'Create Account', desc: 'Sign up free. No credit card. No commitments. Just knowledge.', delay: '200ms' },
            { num: '2', title: 'Browse or Upload', desc: 'Find notes by subject or contribute your own. PDF or text.', delay: '400ms' },
            { num: '3', title: 'Learn Faster', desc: 'AI summaries, ratings, saved collection — ace any exam.', delay: '600ms' },
          ].map((step, i) => (
            <div key={i} className="opacity-0 animate-fade-up text-center group relative z-10" style={{ animationDelay: step.delay, animationFillMode: 'forwards' }}>
              <div className="w-12 h-12 rounded-full bg-[#0F1012] border-2 border-[#1F2023] mx-auto mb-5 relative flex items-center justify-center group-hover:scale-110 group-hover:bg-[#00C896]/10 group-hover:border-[#00C896]/30 transition-all duration-300">
                <div className="absolute inset-0 rounded-full border border-[#00C896]/20 animate-ping-slow hidden group-hover:block"></div>
                <span className="font-display text-xl font-bold text-[#A1A1AA] group-hover:text-[#00C896] transition-colors">{step.num}</span>
              </div>
              <h3 className="font-display text-lg font-bold text-[#F5F5F5] mb-2 group-hover:text-[#00C896] transition-colors">{step.title}</h3>
              <p className="text-[#A1A1AA] text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━ CTA BANNER ━━━━━━━━━━ */}
      <section className="py-20 px-6 relative overflow-hidden bg-[#0F1012] border-y border-[#1F2023]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00C896]/8 blur-[100px] rounded-full animate-glow-pulse pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(#1F2023_1px,transparent_1px),linear-gradient(90deg,#1F2023_1px,transparent_1px)] bg-[size:40px_40px] opacity-15"></div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="opacity-0 animate-fade-up font-display text-4xl lg:text-5xl font-bold text-[#F5F5F5]" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>Ready to study smarter?</h2>
          <p className="opacity-0 animate-fade-up text-[#A1A1AA] mt-4 mb-8 text-lg" style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}>Join NoteNest today and access thousands of premium study notes.</p>
          <div className="opacity-0 animate-fade-up flex flex-col sm:flex-row gap-3 justify-center" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
            <button onClick={() => navigate('/register')} className="bg-[#00C896] hover:bg-[#00A87E] text-[#08090A] font-semibold rounded-xl px-7 py-3 text-base hover:shadow-2xl hover:shadow-[#00C896]/20 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none">
              Create Free Account &rarr;
            </button>
            <button onClick={() => navigate('/register')} className="bg-transparent border border-[#1F2023] hover:border-[#00C896]/50 text-[#A1A1AA] hover:text-[#F5F5F5] font-medium rounded-xl px-7 py-3 text-base hover:-translate-y-0.5 transition-all duration-200">
              Browse Notes
            </button>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ FOOTER ━━━━━━━━━━ */}
      <footer className="border-t border-[#1F2023] bg-[#08090A] py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 group inline-flex">
              <div className="w-7 h-7 bg-[#00C896] rounded flex items-center justify-center text-[#08090A] font-display font-bold text-xs group-hover:scale-110 transition-all">N</div>
              <span className="font-display text-base font-bold text-[#F5F5F5]">NoteNest</span>
            </Link>
            <p className="text-[#52525B] text-sm pr-4">The community-powered study notes platform.</p>
          </div>

          <div>
            <h4 className="font-bold text-[#F5F5F5] mb-4 text-sm">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/browse" className="text-[#52525B] hover:text-[#00C896] text-sm transition-colors">Browse Notes</Link></li>
              <li><Link to="/upload" className="text-[#52525B] hover:text-[#00C896] text-sm transition-colors">Upload Notes</Link></li>
              <li><Link to="/profile" className="text-[#52525B] hover:text-[#00C896] text-sm transition-colors">My Profile</Link></li>
              <li><Link to="/admin" className="text-[#52525B] hover:text-[#00C896] text-sm transition-colors">Admin Panel</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#F5F5F5] mb-4 text-sm">Account</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/login')} className="text-[#52525B] hover:text-[#00C896] text-sm transition-colors focus:outline-none">Login</button></li>
              <li><button onClick={() => navigate('/register')} className="text-[#52525B] hover:text-[#00C896] text-sm transition-colors focus:outline-none">Register</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#F5F5F5] mb-4 text-sm">Info</h4>
            <ul className="space-y-2">
              <li><a href="/#how-it-works" className="text-[#52525B] hover:text-[#00C896] text-sm transition-colors">How it Works</a></li>
              <li><a href="#about" className="text-[#52525B] hover:text-[#00C896] text-sm transition-colors">About</a></li>
              <li><a href="#contact" className="text-[#52525B] hover:text-[#00C896] text-sm transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-[#1F2023] flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-[#52525B] text-xs">&copy; 2026 NoteNest. All rights reserved.</span>
          <span className="text-[#52525B] text-xs">Built for students, by Moni Patidar.</span>
        </div>
      </footer>
    </div>
  );
}
