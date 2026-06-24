/** @type {import('tailwindcss').Config} */
// Design tokens transcribed from the provided "Clinical Precision" design system (DESIGN.md).
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f7f9fb',
        surface: '#f7f9fb',
        'surface-lowest': '#ffffff',
        'surface-low': '#f2f4f6',
        'surface-container': '#eceef0',
        'surface-high': '#e6e8ea',
        'surface-highest': '#e0e3e5',
        'on-surface': '#191c1e',
        'on-surface-variant': '#45464d',
        outline: '#76777d',
        'outline-variant': '#c6c6cd',
        // Brand
        navy: '#131b2e',
        primary: '#131b2e',
        secondary: '#712ae2',
        'secondary-container': '#8a4cfc',
        'secondary-soft': '#eaddff',
        cyan: '#4cd7f6',
        'cyan-deep': '#0090a9',
        // System
        success: '#059669',
        warning: '#d97706',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
      },
      boxShadow: {
        glass: '0 8px 24px -8px rgba(15, 23, 42, 0.10)',
        float: '0 20px 25px -5px rgba(15, 23, 42, 0.15)',
      },
      backgroundImage: {
        'ai-gradient': 'linear-gradient(135deg, #4cd7f6 0%, #712ae2 100%)',
      },
    },
  },
  plugins: [],
}
