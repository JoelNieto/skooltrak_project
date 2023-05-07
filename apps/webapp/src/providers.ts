import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { appRoutes } from './app/app.routes';

export const providers = [
  importProvidersFrom(BrowserModule, BrowserAnimationsModule),
  provideHttpClient(withInterceptorsFromDi()),
  provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
];
