const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  darkMode: 'media',
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
    join(__dirname, '../../apps/web-app/src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, '../onboarding/src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, '../../libs/ui/src/**/!(*.stories|*.spec).{ts,html}'),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Urbanist', 'Helvetica Neue', 'sans-serif'],
        title: ['Gabarito', 'Helvetica Neue', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('flowbite/plugin')],
};
