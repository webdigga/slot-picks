module.exports = {
  content: [
    './src/**/*.{html,njk,js}',
    './src/index.html',
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        // Dark backgrounds
        'bg-primary': '#0D0D0D',
        'bg-secondary': '#1A1A2E',
        'bg-card': '#16213E',
        'bg-card-hover': '#1E2A4A',

        // Neon accents
        'neon-green': '#00FF88',
        'neon-green-dim': '#00CC6A',
        'neon-purple': '#9D4EDD',
        'neon-purple-dim': '#7B3DB5',
        'neon-gold': '#FFD700',
        'neon-gold-dim': '#D4B000',
        'neon-blue': '#00D4FF',
        'neon-blue-dim': '#00A8CC',
        'neon-red': '#FF4757',

        // Text colors
        'text-primary': '#FFFFFF',
        'text-secondary': '#B8B8B8',
        'text-muted': '#6B7280',

        // Borders
        'border-dark': '#2D2D44',
        'border-subtle': '#3D3D5C',
        'border-glow': '#00FF88',
      },
      screens: {
        'xs': '440px',
        '3xl': '1700px'
      },
      boxShadow: {
        'neon-green': '0 0 5px #00FF88, 0 0 20px rgba(0, 255, 136, 0.3)',
        'neon-green-lg': '0 0 10px #00FF88, 0 0 40px rgba(0, 255, 136, 0.4), 0 0 80px rgba(0, 255, 136, 0.2)',
        'neon-purple': '0 0 5px #9D4EDD, 0 0 20px rgba(157, 78, 221, 0.3)',
        'neon-purple-lg': '0 0 10px #9D4EDD, 0 0 40px rgba(157, 78, 221, 0.4)',
        'neon-gold': '0 0 5px #FFD700, 0 0 20px rgba(255, 215, 0, 0.3)',
        'neon-blue': '0 0 5px #00D4FF, 0 0 20px rgba(0, 212, 255, 0.3)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 255, 136, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-neon': 'linear-gradient(135deg, #9D4EDD 0%, #00FF88 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0D0D0D 0%, #1A1A2E 100%)',
        'gradient-card': 'linear-gradient(145deg, #16213E 0%, #1A1A2E 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0D0D0D 0%, #1A1A2E 50%, #16213E 100%)',
        'mesh-pattern': 'radial-gradient(circle at 25% 25%, rgba(157, 78, 221, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0, 255, 136, 0.1) 0%, transparent 50%)',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'border-glow': 'border-glow 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': {
            boxShadow: '0 0 5px #00FF88, 0 0 20px rgba(0, 255, 136, 0.3)'
          },
          '50%': {
            boxShadow: '0 0 10px #00FF88, 0 0 40px rgba(0, 255, 136, 0.5)'
          },
        },
        'glow': {
          '0%': {
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor'
          },
          '100%': {
            textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor'
          },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'border-glow': {
          '0%, 100%': { borderColor: 'rgba(0, 255, 136, 0.3)' },
          '50%': { borderColor: 'rgba(0, 255, 136, 0.8)' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: '#B8B8B8',
            h1: {
              color: '#FFFFFF',
            },
            h2: {
              color: '#FFFFFF',
            },
            h3: {
              color: '#FFFFFF',
            },
            h4: {
              color: '#FFFFFF',
            },
            p: {
              color: '#B8B8B8',
            },
            a: {
              color: '#00D4FF',
              '&:hover': {
                color: '#00FF88',
              },
            },
            strong: {
              color: '#FFFFFF',
            },
            li: {
              color: '#B8B8B8',
            },
            blockquote: {
              color: '#B8B8B8',
              borderLeftColor: '#9D4EDD',
            },
          },
        },
        invert: {
          css: {
            color: '#B8B8B8',
          },
        },
      })
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
