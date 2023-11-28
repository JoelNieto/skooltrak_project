import { HttpClient, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  RouteReuseStrategy,
  withPreloading,
} from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { authState } from '@skooltrak/auth';
import { APP_CONFIG, environment } from '@skooltrak/environments';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

const translateLoader = (http: HttpClient): TranslateLoader =>
  new TranslateHttpLoader(http, '/assets/i18n/', 'json');

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideStore(),
    provideState(authState.authFeature),
    provideEffects(authState.effects),
    provideStoreDevtools({connectInZone: true}),
    importProvidersFrom(
      BrowserModule,
      IonicModule.forRoot(),
      TranslateModule.forRoot({
        defaultLanguage: 'es',
        loader: {
          provide: TranslateLoader,
          useFactory: translateLoader,
          deps: [HttpClient],
        },
      }),
    ),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideRouter(routes, withPreloading(PreloadAllModules)),
    { provide: APP_CONFIG, useValue: environment },
  ],
});
