import { HttpClient, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideRouter, RouteReuseStrategy, withComponentInputBinding } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { APP_CONFIG, environment } from '@skooltrak/environments';
import { mobileAuthState } from '@skooltrak/store';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

const translateLoader = (http: HttpClient): TranslateLoader =>
  new TranslateHttpLoader(http, '/assets/i18n/', '.json');

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideStore(),
    provideState(mobileAuthState.mobileAuthFeature),
    provideEffects(mobileAuthState.effects),
    provideStoreDevtools({ connectInZone: true }),
    importProvidersFrom(
      BrowserModule,
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
    provideIonicAngular(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: APP_CONFIG, useValue: environment },
  ],
});
