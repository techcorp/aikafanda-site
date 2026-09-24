/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './data/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0B0B0F',
        surface: '#141419',
        'surface-2': '#1B1B21',
        line: '#23232C',
        indigo: {
          DEFAULT: '#6C5CE7',
          hi: '#7D6FF0',
          soft: '#C6BFFF',
        },
        amber: {
          DEFAULT: '#FFB020',
          soft: '#FFBD58',
        },
        fg: '#F4F4F6',
        muted: '#9A9AA6',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Space Grotesk', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        hero: ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1.06', letterSpacing: '-0.03em', fontWeight: '700' }],
        h1: ['clamp(2rem, 4.4vw, 2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '600' }],
        h2: ['clamp(1.5rem, 3vw, 1.75rem)', { lineHeight: '1.28', letterSpacing: '-0.02em', fontWeight: '600' }],
        h3: ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '500' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        'body-md': ['0.9375rem', { lineHeight: '1.6', letterSpacing: '-0.005em' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.54' }],
        code: ['0.875rem', { lineHeight: '1.43', letterSpacing: '0.02em', fontWeight: '500' }],
        kicker: ['0.6875rem', { lineHeight: '1.45', letterSpacing: '0.06em', fontWeight: '600' }],
      },
      borderRadius: { DEFAULT: '0.5rem', md: '0.75rem', lg: '1rem', xl: '1.5rem' },
      maxWidth: { shell: '1280px', prose: '68ch' },
      boxShadow: {
        glow: '0 0 24px -4px rgba(108, 92, 231, 0.32)',
        'glow-strong': '0 4px 20px rgba(108, 92, 231, 0.4)',
        panel: '0 16px 32px -8px rgba(0,0,0,0.6)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.45 } },
        breathe: { '0%,100%': { opacity: 0.35, transform: 'scale(1)' }, '50%': { opacity: 0.6, transform: 'scale(1.08)' } },
        caret: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        float: 'float 9s ease-in-out infinite',
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
        breathe: 'breathe 8s ease-in-out infinite',
        caret: 'caret 1.1s steps(1) infinite',
      },
    },
  },
  plugins: [],
}
