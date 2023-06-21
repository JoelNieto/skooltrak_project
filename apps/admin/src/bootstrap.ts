import { ICONS_OUTLINE, IconsModule } from '@amithvns/ng-heroicons';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      IconsModule.withIcons({ ...ICONS_OUTLINE })
    ),
    provideRouter(appRoutes, withDisabledInitialNavigation()),
  ],
}).catch((err) => console.error(err));
