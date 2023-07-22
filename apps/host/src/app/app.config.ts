import { ICONS_OUTLINE, IconsModule } from '@amithvns/ng-heroicons';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, TitleStrategy, withComponentInputBinding, withDisabledInitialNavigation } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { state } from '@skooltrak/auth';
import { PageTitleStrategy } from '@skooltrak/ui';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { appRoutes } from './app.routes';

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
    provideStore({ auth: state.authFeature.reducer }),
    provideEffects(state.effects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), trace: true }),
    importProvidersFrom(
      BrowserModule,
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
