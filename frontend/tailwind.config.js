/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366F1',
          hover: '#4F46E5',
        },
        surface: {
          DEFAULT: '#1E293B',
          raised: '#263548',
        },
        status: {
          verified: '#22C55E',
          inaccurate: '#F59E0B',
          false: '#EF4444',
          unverifiable: '#94A3B8',
        },
        bg: {
          base: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
