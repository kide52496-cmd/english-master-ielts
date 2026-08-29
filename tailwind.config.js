/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'bounce-slow':  'bounce 2s infinite',
        'pulse-slow':   'pulse 3s infinite',
        'fade-in':      'fadeIn 0.35s ease-out both',
        'fade-up':      'fadeUp 0.45s cubic-bezier(.2,.8,.2,1) both',
        'slide-down':   'slideDown 0.4s cubic-bezier(.2,.8,.2,1) both',
        'pop':          'pop 0.4s cubic-bezier(.2,.9,.3,1.4) both',
        'shimmer':      'shimmer 2.4s linear infinite',
        'gradient-x':   'gradientX 8s ease infinite',
        'float':        'float 6s ease-in-out infinite',
        'float-slow':   'float 9s ease-in-out infinite',
        'glow':         'glow 2.4s ease-in-out infinite',
        'tilt':         'tilt 8s ease-in-out infinite',
        'spin-slow':    'spin 8s linear infinite',
        'wiggle':       'wiggle 0.6s ease-in-out',
        'count-up':     'countUp 0.6s cubic-bezier(.2,.8,.2,1) both',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%':   { opacity: '0', transform: 'scale(0.9)' },
          '60%':  { opacity: '1', transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(99,102,241,0.45)' },
          '50%':      { boxShadow: '0 0 28px 6px rgba(99,102,241,0.35)' },
        },
        tilt: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%':      { transform: 'rotate(1deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%':      { transform: 'rotate(-3deg)' },
          '75%':      { transform: 'rotate(3deg)' },
        },
        countUp: {
          '0%':   { opacity: '0', transform: 'translateY(6px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0)   scale(1)' },
        },
      },
      backgroundSize: {
        '200': '200% 200%',
        '300': '300% 300%',
      },
      boxShadow: {
        'glow-sm': '0 0 12px 0 rgba(99,102,241,0.30)',
        'glow':    '0 0 24px 0 rgba(99,102,241,0.40)',
        'glow-lg': '0 0 48px 0 rgba(99,102,241,0.45)',
        'inner-soft': 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
}
