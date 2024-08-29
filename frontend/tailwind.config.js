/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,jsx}"],
    theme: {
        extend: {
          colors: {
            'var-color-text': 'var(--color-text)',
            'var-color-primary': 'var(--color-primary)',
          },
          spacing: {
            '10%': '10%',
            '24px': '24px',
            '61px': '61px',
            '47px': '47px',
          },
          zIndex: {
            '20': '20',
            '1': '1',
          },
        },
      },
      variants: {},
      plugins: [],
  }
