import { ICONS_OUTLINE, IconsModule } from '@amithvns/ng-heroicons';
import { registerLocaleData } from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import localeEs from '@angular/common/locales/es-PA';
import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, TitleStrategy, withComponentInputBinding, withDisabledInitialNavigation } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { authState } from '@skooltrak/auth';
import { PageTitleStrategy } from '@skooltrak/ui';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { QuillModule } from 'ngx-quill';

import { appRoutes } from './app.routes';

registerLocaleData(localeEs, 'es-PA');

const translateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, '/assets/i18n/', '.json');
export const AppConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    { provide: TitleStrategy, useClass: PageTitleStrategy },
    provideRouter(
      appRoutes,
      withDisabledInitialNavigation(),
      withComponentInputBinding()
    ),
    provideAnimations(),
    provideStore(),
    provideState(authState.authFeature),
    provideEffects(authState.effects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), trace: true }),
    importProvidersFrom(
      QuillModule.forRoot(),
      BrowserModule,
      BrowserAnimationsModule,
      IconsModule.withIcons({ ...ICONS_OUTLINE }),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: translateLoader,
          deps: [HttpClient],
        },
      }),
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      })
    ),
  ],
};
