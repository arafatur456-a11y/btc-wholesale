/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F2FBFB',
          100: '#DDF6F7',
          200: '#B4EDF0',
          DEFAULT: '#1ECAD3',
          500: '#1ECAD3',
          600: '#17B8C2',
          700: '#0F8A92',
          800: '#0B6A70',
          900: '#0A4B50',
        },
        ink: { DEFAULT: '#14181A', 2: '#1E2427', 3: '#2A3236' },
        line: { DEFAULT: '#E4ECED', soft: '#EEF4F4', strong: '#D3E0E1' },
        ice: '#F2FBFB',
        paper: '#FBFCFC',
        slate: { DEFAULT: '#64748B', 400: '#94A3B8', 600: '#475569' },
        gold: { DEFAULT: '#C9A23F', light: '#E8D08A', dark: '#8A6B1F', 50: '#FBF6E8' },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,24,26,.04), 0 12px 32px -20px rgba(20,24,26,.18)',
        lift: '0 40px 80px -40px rgba(11,74,80,.45), 0 18px 36px -24px rgba(20,24,26,.25)',
        frame: '0 50px 100px -50px rgba(20,24,26,.55), 0 24px 48px -32px rgba(11,74,80,.35)',
      },
      keyframes: {
        shimmer: { '0%': { transform: 'translateX(-120%) skewX(-18deg)' }, '100%': { transform: 'translateX(220%) skewX(-18deg)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        spinslow: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        shimmer: 'shimmer 5.5s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite',
        spinslow: 'spinslow 40s linear infinite',
      },
    },
  },
  plugins: [],
}
