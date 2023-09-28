module.exports = {
  name: 'web-app',
  exposes: {
    './Routes': 'apps/web-app/src/app/remote-entry/entry.routes.ts',
  },
};
