import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3500,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      },
    },
    importProvidersFrom(BrowserAnimationsModule, MatSnackBarModule),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
  ],
};
