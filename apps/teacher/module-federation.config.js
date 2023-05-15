module.exports = {
  name: 'teacher',
  exposes: {
    './Module': 'apps/teacher/src/app/remote-entry/entry.module.ts',
  },
};
