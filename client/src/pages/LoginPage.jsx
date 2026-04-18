import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../features/auth/authSlice";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const { email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
    if (user) {
      navigate("/browse");
      dispatch(reset());
    }


   
  if (user) {
    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/browse");
    }
  }
}, [user, isError, message, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-[#08090A] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background Effects - Landing page jaisa */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(#1F2023_1px,transparent_1px),linear-gradient(90deg,#1F2023_1px,transparent_1px)] bg-[size:60px_60px] opacity-20"></div>
        {/* Green glow top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00C896]/10 rounded-full blur-[120px]"></div>
        {/* Green glow bottom left */}
        <div className="absolute bottom-0 -left-32 w-[350px] h-[350px] bg-[#00C896]/6 rounded-full blur-[100px]"></div>
        {/* Ping dots */}
        <div className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-[#00C896] animate-ping opacity-40"></div>
        <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 rounded-full bg-[#00C896]/40 animate-ping" style={{ animationDelay: '1000ms' }}></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 rounded-full bg-[#00C896]/30 animate-ping" style={{ animationDelay: '500ms' }}></div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#00C896]/10 border border-[#00C896]/20 rounded-full px-4 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00C896] animate-ping"></div>
            <span className="text-[#00C896] text-xs font-semibold">Welcome back to NoteNest</span>
          </div>
        </div>

        <div className="bg-[#0F1012]/80 backdrop-blur-xl border border-[#1F2023] rounded-2xl p-8 shadow-2xl shadow-black/50 hover:border-[#00C896]/20 transition-colors duration-500">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 group w-fit">
            <div className="w-9 h-9 bg-[#00C896] rounded-xl flex items-center justify-center text-[#08090A] font-bold text-sm group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#00C896]/30 transition-all duration-300">N</div>
            <span className="text-[#F5F5F5] font-bold text-lg">NoteNest</span>
          </Link>

          <h1 className="text-2xl font-bold text-[#F5F5F5] mb-1">Welcome back</h1>
          <p className="text-[#A1A1AA] text-sm mb-8">Sign in to access your notes and collection.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <label className="block text-[#A1A1AA] text-xs font-semibold uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-[#161719] border border-[#1F2023] rounded-xl px-4 py-3 text-[#F5F5F5] text-sm placeholder-[#52525B] focus:outline-none focus:border-[#00C896] focus:ring-1 focus:ring-[#00C896]/20 transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#A1A1AA] text-xs font-semibold uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#161719] border border-[#1F2023] rounded-xl px-4 py-3 text-[#F5F5F5] text-sm placeholder-[#52525B] focus:outline-none focus:border-[#00C896] focus:ring-1 focus:ring-[#00C896]/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#A1A1AA] text-xs focus:outline-none transition-colors"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00C896] hover:bg-[#00A87E] disabled:opacity-60 disabled:cursor-not-allowed text-[#08090A] font-semibold py-3 rounded-xl mt-1 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#00C896]/20 transition-all duration-200"
            >
              {isLoading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#1F2023]"></div>
            <span className="text-[#52525B] text-xs font-semibold uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-[#1F2023]"></div>
          </div>

          <p className="text-center text-sm text-[#A1A1AA]">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#00C896] font-semibold hover:underline ml-1">
              Create one free
            </Link>
          </p>
        </div>

        {/* Bottom trust badges */}
        <div className="flex items-center justify-center gap-6 mt-6 text-[#52525B] text-xs">
          <span>✓ Free to use</span>
          <span>✓ No credit card</span>
          <span>✓ AI summaries</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;