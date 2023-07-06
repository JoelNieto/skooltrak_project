import { ICONS_OUTLINE, IconsModule } from '@amithvns/ng-heroicons';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, TitleStrategy, withComponentInputBinding, withDisabledInitialNavigation } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { state } from '@skooltrak/auth';
import { PageTitleStrategy } from '@skooltrak/ui';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';

const translateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, '/assets/i18n/', '.json');

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    { provide: TitleStrategy, useClass: PageTitleStrategy },
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      IconsModule.withIcons({ ...ICONS_OUTLINE }),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: translateLoader,
          deps: [HttpClient],
        },
      })
    ),
    provideRouter(
      appRoutes,
      withDisabledInitialNavigation(),
      withComponentInputBinding()
    ),
    provideStore({ auth: state.authFeature.reducer }),
    provideEffects(state.effects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), trace: true }),
  ],
}).catch((err) => console.error(err));
