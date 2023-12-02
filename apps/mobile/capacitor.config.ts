import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Skooltrak',
  webDir: '../../dist/apps/mobile',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
};

export default config;
