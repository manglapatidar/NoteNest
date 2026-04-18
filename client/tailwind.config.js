/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Manrope', 'sans-serif']
      },
      keyframes: {
        'fade-up':    { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-down':  { '0%': { opacity: '0', transform: 'translateY(-20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-in':    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-in':   { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        'fade-right': { '0%': { opacity: '0', transform: 'translateX(-20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        'glow-pulse': { '0%, 100%': { opacity: '0.4' }, '50%': { opacity: '0.9' } },
        'float':      { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
        'float-alt':  { '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' }, '50%': { transform: 'translateY(-15px) rotate(3deg)' } },
        'shimmer':    { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'ping-slow':  { '0%': { transform: 'scale(1)', opacity: '1' }, '75%, 100%': { transform: 'scale(2.5)', opacity: '0' } },
        'blob':       { '0%': { transform: 'translate(0px, 0px) scale(1)' }, '33%': { transform: 'translate(30px, -50px) scale(1.1)' }, '66%': { transform: 'translate(-20px, 20px) scale(0.9)' }, '100%': { transform: 'translate(0px, 0px) scale(1)' } },
        'spin-slow':  { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        'text-gradient': { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
      },
      animation: {
        'fade-up':    'fade-up 0.6s ease-out forwards',
        'fade-down':  'fade-down 0.5s ease-out forwards',
        'fade-in':    'fade-in 0.5s ease-out forwards',
        'scale-in':   'scale-in 0.4s ease-out forwards',
        'fade-right': 'fade-right 0.5s ease-out forwards',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float':      'float 4s ease-in-out infinite',
        'float-alt':  'float-alt 5s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
        'ping-slow':  'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'blob':       'blob 7s infinite alternate',
        'spin-slow':  'spin-slow 15s linear infinite',
        'text-gradient': 'text-gradient 3s ease infinite',
      },
    },
  },
  plugins: [],
}
