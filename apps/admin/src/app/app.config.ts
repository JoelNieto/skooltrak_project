import { ICONS_OUTLINE, IconsModule } from '@amithvns/ng-heroicons';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withDisabledInitialNavigation } from '@angular/router';

import { appRoutes } from './app.routes';

export const AppConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      IconsModule.withIcons({ ...ICONS_OUTLINE })
    ),
    provideRouter(
      appRoutes,
      withDisabledInitialNavigation(),
      withComponentInputBinding()
    ),
  ],
};
