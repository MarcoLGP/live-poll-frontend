import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideTranslateService } from "@ngx-translate/core";
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthInterceptor } from './core/interceptors/AuthInterceptor';
import { AuthService } from '@services/auth';
import { lastValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { environment } from '@env/environment';
import { AppInitService } from '@services/app-init';

export function initializeAuth(authService: AuthService, appInit: AppInitService) {
  return () => lastValueFrom(authService.refreshToken())
    .catch(() => {})
    .finally(() => appInit.setInitialized()); 
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService, AppInitService],
      multi: true
    },
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json'
      }),
      fallbackLang: 'pt-BR',
      lang: 'pt-BR'
    })
  ]
};