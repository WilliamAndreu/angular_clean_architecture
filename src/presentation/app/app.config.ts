import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { APP_ROUTES } from './app.routes';
import { StorageSource } from 'src/core/services/storage/source/storage-source.interface';
import { LocalStorageService } from 'src/core/services/storage/local-storage/local-storage.service';
import { publicInterceptor } from 'src/core/interceptors/public.interceptor';
import { authInterceptor } from 'src/core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([publicInterceptor, authInterceptor])),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    { provide: StorageSource, useClass: LocalStorageService },
    provideTranslateService({ defaultLanguage: 'en' }),
    provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json' }),
  ],
};
