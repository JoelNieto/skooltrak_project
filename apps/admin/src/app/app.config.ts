import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  provideRouter,
  withComponentInputBinding,
  withDisabledInitialNavigation,
} from '@angular/router';

import { appRoutes } from './app.routes';

export const AppConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule),
    provideRouter(
      appRoutes,
      withDisabledInitialNavigation(),
      withComponentInputBinding()
    ),
  ],
};
