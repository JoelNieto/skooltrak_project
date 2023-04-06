import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { appRoutes } from './app/app.routes';

export const providers = [
  {
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useValue: { appearance: 'fill' },
  },
  importProvidersFrom(BrowserModule, BrowserAnimationsModule),
  provideHttpClient(withInterceptorsFromDi()),
  provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
];
