module.exports = {
  name: 'student',
  exposes: {
    './Module': 'apps/student/src/app/remote-entry/entry.module.ts',
  },
};
