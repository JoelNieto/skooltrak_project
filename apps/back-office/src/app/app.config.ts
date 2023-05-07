import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
  ],
};
