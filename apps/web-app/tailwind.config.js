const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  darkMode: 'media',
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'Helvetica Neue', 'sans-serif'],
        title: ['Unbounded', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('flowbite/plugin')],
};
