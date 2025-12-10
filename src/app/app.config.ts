import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideFirestore } from '@angular/fire/firestore';
import { provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { getFirebaseApp, auth, firestore, storage } from './firebase.config';

// Firebase providers
const firebaseProviders = [
  provideFirebaseApp(() => getFirebaseApp()),
  provideAuth(() => auth),
  provideFirestore(() => firestore),
  provideStorage(() => storage)
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ 
      eventCoalescing: true
    }),
    provideRouter(routes),
    // Enable client hydration for better SSR performance
    provideClientHydration(),
    provideHttpClient(
      withFetch() // Use fetch API for better SSR support
    ),
    ...(TranslateModule.forRoot({
      defaultLanguage: 'en',
      useDefaultLang: true,
      loader: {
        provide: TranslateModule,
        useFactory: () => ({
          defaultLanguage: 'en',
          useDefaultLang: true
        })
      }
    }).providers ?? []),
    provideTranslateHttpLoader({
      prefix: '/assets/i18n/',
      suffix: '.json'
    }),
    ...firebaseProviders
  ]
};
