import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.company.hrms.employee',
  appName: 'HRMS Employee',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
