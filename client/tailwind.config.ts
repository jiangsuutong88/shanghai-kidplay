/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,scss,css}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        },
        warm: {
          yellow: '#FBBF24',
          orange: '#FB923C',
          peach: '#FDBA74',
        },
        nature: {
          green: '#34D399',
          blue: '#60A5FA',
          sky: '#38BDF8',
        }
      },
      fontSize: {
        'grandma': '18px',
        'grandma-lg': '20px',
        'grandma-xl': '24px',
        'grandma-2xl': '28px',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom, 0px)',
      },
      minHeight: {
        'tap': '44px',
      },
      borderRadius: {
        'card': '16px',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 20px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
  // 小程序端不需要 preflight
  corePlugins: {
    preflight: false,
  },
}
