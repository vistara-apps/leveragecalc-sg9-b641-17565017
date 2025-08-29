
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(204 70% 53%)',
        accent: 'hsl(180 70% 53%)',
        bg: 'hsl(210 40% 96%)',
        surface: 'hsl(210 40% 98%)',
        'text-primary': 'hsl(210 40% 15%)',
        'text-secondary': 'hsl(210 40% 40%)',
      },
      maxWidth: {
        'container': '28rem',
      },
      spacing: {
        'sm-spacing': '8px',
        'md-spacing': '12px',
        'lg-spacing': '20px',
      },
      borderRadius: {
        'sm-radius': '6px',
        'md-radius': '10px',
        'lg-radius': '16px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(210, 40%, 15%, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
