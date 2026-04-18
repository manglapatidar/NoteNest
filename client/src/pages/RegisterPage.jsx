import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';


const RegisterPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

   
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

   const { name, email, password } = formData;

  const handleRegister = (e) => {
    e.preventDefault()

    // Register User
    dispatch(register({
      name,
      email,
      password
    }));
  };

  useEffect(() => {
    if (isError && message) {
      toast.error(message, {position : "top-center"});
      dispatch(reset());
    }

    if (user) {
      navigate("/upload");
      dispatch(reset());
    }


  }, [user, isError, message, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-[#08090A] flex pt-16">

      {/* LEFT PANEL */}
      <div className="w-1/2 bg-[#0F1012] border-r border-[#1F2023] hidden lg:flex flex-col justify-between p-12">
        <div>


          <div className="mt-16 max-w-lg">
            {/* Animated heading */}
            <h2
              className="text-3xl font-bold text-white leading-snug"
              style={{ animation: 'fadeSlideUp 0.7s ease forwards', opacity: 0 }}
            >
              Knowledge shared is{' '}
              <span className="text-[#00C896]">knowledge multiplied.</span>
            </h2>

            <p
              className="mt-4 text-[#A1A1AA] text-base leading-relaxed"
              style={{ animation: 'fadeSlideUp 0.7s ease 0.2s forwards', opacity: 0 }}
            >
              Join a growing community of students who upload, discover, and learn from each other's notes — anytime, anywhere.
            </p>

            {/* Animated stats row */}
            <div
              className="mt-10 flex flex-col gap-4"
              style={{ animation: 'fadeSlideUp 0.7s ease 0.4s forwards', opacity: 0 }}
            >
              {[
                { value: '12,000+', label: 'Notes Uploaded' },
                { value: '3,400+', label: 'Active Students' },
                { value: '98%', label: 'Satisfaction Rate' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-1 h-8 bg-[#00C896] rounded-full opacity-80" />
                  <div>
                    <span className="text-[#F5F5F5] font-bold text-lg">{stat.value}</span>
                    <span className="text-[#52525B] text-sm ml-2">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating note cards */}
            <div
              className="mt-12 relative h-28"
              style={{ animation: 'fadeSlideUp 0.7s ease 0.6s forwards', opacity: 0 }}
            >
              {[
                { text: '📘 Physics — Chapter 5 Notes', top: '0px', left: '0px', delay: '0s' },
                { text: '📗 Organic Chemistry Summary', top: '30px', left: '60px', delay: '0.3s' },
                { text: '📙 Data Structures Cheatsheet', top: '60px', left: '20px', delay: '0.6s' },
              ].map((card, i) => (
                <div
                  key={i}
                  className="absolute bg-[#161719] border border-[#1F2023] rounded-xl px-4 py-2 text-xs text-[#A1A1AA] whitespace-nowrap shadow-lg"
                  style={{
                    top: card.top,
                    left: card.left,
                    animation: `floatCard 3s ease-in-out ${card.delay} infinite alternate`,
                  }}
                >
                  {card.text}
                </div>
              ))}
            </div>

            <style>{`
              @keyframes fadeSlideUp {
                from { opacity: 0; transform: translateY(20px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              @keyframes floatCard {
                from { transform: translateY(0px); }
                to   { transform: translateY(-8px); }
              }
            `}</style>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          <h1 className="text-3xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-[#A1A1AA] text-sm mb-6">Join thousands of students sharing notes.</p>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="block text-[#A1A1AA] text-xs font-semibold uppercase tracking-widest mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full bg-[#161719] border border-[#1F2023] rounded-xl px-4 py-3 text-white text-sm placeholder-[#52525B] focus:outline-none focus:border-[#00C896] transition-all"
              />
            </div>

            <div>
              <label className="block text-[#A1A1AA] text-xs font-semibold uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-[#161719] border border-[#1F2023] rounded-xl px-4 py-3 text-white text-sm placeholder-[#52525B] focus:outline-none focus:border-[#00C896] transition-all"
              />
            </div>

            <div>
              <label className="block text-[#A1A1AA] text-xs font-semibold uppercase tracking-widest mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-[#161719] border border-[#1F2023] rounded-xl px-4 py-3 text-white text-sm placeholder-[#52525B] focus:outline-none focus:border-[#00C896] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00C896] hover:bg-[#00A87E] disabled:opacity-60 text-black font-semibold py-3 rounded-xl mt-2 transition-all"
            >
              {isLoading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p className="text-center text-sm text-[#A1A1AA] mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#00C896] font-medium hover:underline">Sign in</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
export default RegisterPage;