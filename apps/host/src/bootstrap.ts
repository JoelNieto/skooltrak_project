import { ICONS_OUTLINE, IconsModule } from '@amithvns/ng-heroicons';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { state } from '@skooltrak/auth';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      IconsModule.withIcons({ ...ICONS_OUTLINE })
    ),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideStore({ auth: state.authFeature.reducer }),
    provideEffects(state.effects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), trace: true }),
  ],
}).catch((err) => console.error(err));
