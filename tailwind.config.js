module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      colors: {
        workspace: {
          bg: '#0F1117',
          surface: '#1A1D24',
          surfaceHover: '#222630',
          border: '#262A34',
          borderLight: '#353B49',
          text: '#E6EDF3',
          muted: '#8B949E',
          accent: '#10B981',
          accentHover: '#059669',
          danger: '#EF4444'
        }
      },
      animation: {
        'blob': 'blob 10s infinite alternate',
        'blob-reverse': 'blob-reverse 12s infinite alternate',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '100%': { transform: 'translate(30px, -50px) scale(1.1)' },
        },
        'blob-reverse': {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '100%': { transform: 'translate(-30px, 50px) scale(1.1)' },
        }
      }
    }
  },
  plugins: [],
}
