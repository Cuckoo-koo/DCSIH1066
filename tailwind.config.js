/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          50: '#FDF8F3',
          100: '#FAECE0',
          200: '#F5D7BE',
          300: '#EEB98F',
          400: '#E79B5F',
          500: '#E07A1F', // Primary Heritage Orange
          600: '#C86613',
          700: '#9E4F0D',
          800: '#753A0A',
          900: '#4C2405',
        },
        discovery: {
          50: '#EFF6FF',
          500: '#2563EB', // Secondary Trust & Discovery Blue
          600: '#1D4ED8',
          700: '#1E40AF',
        },
        growth: {
          50: '#F0FDF4',
          500: '#2E7D32', // Accent Growth & Nature Green
          600: '#1B5E20',
          700: '#144A18',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FAF8F3', // Background
          200: '#F3EFE6',
          300: '#E7E0D3',
          400: '#D5CBBB',
        },
        charcoal: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          700: '#374151',
          800: '#1F2937',
          900: '#111827', // Text Charcoal
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        serif: ['Cinzel', 'Merriweather', 'serif'],
      },
      boxShadow: {
        'warm': '0px 20px 40px rgba(224, 122, 31, 0.12)',
        'card-hover': '0px 20px 40px rgba(0, 0, 0, 0.12)',
        'orange-glow': '0 0 25px rgba(224, 122, 31, 0.35)',
        'soft-glow': '0 4px 20px rgba(224, 122, 31, 0.18)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(224, 122, 31, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(224, 122, 31, 0.5)' },
        }
      }
    },
  },
  plugins: [],
}
