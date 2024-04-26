import { registerLocaleData } from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import localeEs from '@angular/common/locales/es-MX';
import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { APP_CONFIG, environment } from '@skooltrak/environments';
import { PageTitleStrategy } from '@skooltrak/ui';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { es } from 'date-fns/locale';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideQuillConfig } from 'ngx-quill';

import { appRoutes } from './app.routes';
import { MAT_CARD_CONFIG } from '@angular/material/card';

registerLocaleData(localeEs, 'es-MX');

const translateLoader = (http: HttpClient): TranslateLoader =>
  new TranslateHttpLoader(http, '/assets/i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    { provide: TitleStrategy, useClass: PageTitleStrategy },
    provideRouter(
      appRoutes,
      withEnabledBlockingInitialNavigation(),
      withComponentInputBinding(),
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      withViewTransitions(),
    ),
    provideAnimations(),
    provideCharts(withDefaultRegisterables()),
    provideQuillConfig({
      modules: {
        syntax: true,
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],

          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ direction: 'rtl' }], // text direction

          [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],

          ['clean'], // remove formatting button

          ['link', 'image', 'video'],
        ],
      },
    }),
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      TranslateModule.forRoot({
        defaultLanguage: 'es',
        loader: {
          provide: TranslateLoader,
          useFactory: translateLoader,
          deps: [HttpClient],
        },
      }),
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      }),
      MatDialogModule,
    ),
    { provide: APP_CONFIG, useValue: environment },
    { provide: LOCALE_ID, useValue: 'es-MX' },
    { provide: MAT_DATE_LOCALE, useValue: es },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { verticalPosition: 'top', duration: 3_000 },
    },
    { provide: MAT_CARD_CONFIG, useValue: { appearance: 'outlined' } },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    provideDateFnsAdapter(),
  ],
};
