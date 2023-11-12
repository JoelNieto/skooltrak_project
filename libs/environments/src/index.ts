import { InjectionToken } from '@angular/core';

import { AppConfig } from './lib/app-config';

export * from './lib/app-config';

export const APP_CONFIG = new InjectionToken<AppConfig>('App Config');
