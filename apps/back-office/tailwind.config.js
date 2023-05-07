const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'sans-serif'],
        serif: ['Bitter', 'Times New Roman', 'Times', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('flowbite/plugin')],
};
