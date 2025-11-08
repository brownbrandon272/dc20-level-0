/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Parchment Theme Colors
        parchment: {
          light: '#F5E8C3',
          DEFAULT: '#E8D9B0',
          dark: '#D4C29E',
        },
        brown: {
          text: '#3E2723',
          accent: '#8B4513',
          medium: '#6D4C41',
          light: '#A0826D',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E5C158',
          dark: '#B8941F',
        },
        // Dark Theme Colors (optional for future use)
        charcoal: {
          light: '#2E2E2E',
          DEFAULT: '#212121',
          dark: '#1A1A1A',
        },
        // Stat-specific colors
        hp: {
          DEFAULT: '#C62828',
          light: '#EF5350',
          dark: '#B71C1C',
        },
        pd: {
          DEFAULT: '#757575',
          light: '#BDBDBD',
          dark: '#424242',
        },
        md: {
          DEFAULT: '#5E35B1',
          light: '#9575CD',
          dark: '#4527A0',
        },
        ad: {
          DEFAULT: '#2E7D32',
          light: '#66BB6A',
          dark: '#1B5E20',
        },
      },
      fontFamily: {
        // Fantasy title fonts
        title: ['Cinzel', 'serif'],
        display: ['Pirata One', 'cursive'],
        medieval: ['Uncial Antiqua', 'serif'],
        gothic: ['New Rocker', 'cursive'],
        // Body fonts
        body: ['Merriweather', 'serif'],
        sans: ['Lato', 'sans-serif'],
      },
      fontSize: {
        // Custom font sizes for better hierarchy
        'hero': ['3rem', { lineHeight: '1.1', letterSpacing: '0.02em' }],
        'page-title': ['2rem', { lineHeight: '1.2', letterSpacing: '0.03em' }],
        'section': ['1.5rem', { lineHeight: '1.3', letterSpacing: '0.02em' }],
        'card-title': ['1.25rem', { lineHeight: '1.4' }],
        'stat-value': ['1.75rem', { lineHeight: '1', fontWeight: '700' }],
        'level-badge': ['0.875rem', { lineHeight: '1.2', fontWeight: '500' }],
      },
      boxShadow: {
        'parchment': '0 2px 8px rgba(62, 39, 35, 0.15)',
        'parchment-lg': '0 4px 16px rgba(62, 39, 35, 0.2)',
        'elevated': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'inset-sm': 'inset 0 2px 4px rgba(62, 39, 35, 0.1)',
        'gold': '0 0 12px rgba(212, 175, 55, 0.4)',
      },
      borderRadius: {
        'ornate': '0.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      backgroundImage: {
        'parchment-texture': "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 /%3E%3CfeColorMatrix type=%27saturate%27 values=%270%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27 opacity=%270.05%27/%3E%3C/svg%3E')",
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        modalFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
