/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        success: 'var(--success)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        border: 'var(--color-border)',
        muted: 'var(--color-muted)',
        'muted-light': 'var(--color-muted-light)',
      },
      fontFamily: {
        serif: ['var(--font-ortica)', 'Georgia', 'serif'],
        mono: ['Courier New', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'display': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'heading': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      spacing: {
        navbar: 'var(--navbar-height)',
      },
      letterSpacing: {
        'tighter': '-0.03em',
        'tight': '-0.02em',
        'normal': '-0.01em',
        'wide': '0.05em',
        'wider': '0.1em',
      },
      textDecorationColor: {
        accent: 'var(--accent)',
      },
    },
  },
}
