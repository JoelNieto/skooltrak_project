const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  darkMode: 'media',
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
    join(__dirname, '../admin/src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, '../teacher/src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, '../student/src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, '../../libs/ui/src/**/!(*.stories|*.spec).{ts,html}'),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'sans-serif'],
        title: ['Poppins', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('flowbite/plugin')],
};
