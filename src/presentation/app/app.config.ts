import { provideErrorHandling } from '@di/error/error-handling.di';
import { provideProductsDI } from '@di/products/products.di';
import { provideCartDI } from '@di/cart/cart.di';
import { provideAuthDI } from '@di/auth/auth.di';
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
import { StorageSource } from 'src/core/services/storage/source/storage.source';
import { LocalStorageServiceImp } from 'src/core/services/storage/local-storage/local-storage.service.imp';
import { publicInterceptor } from 'src/core/interceptors/public.interceptor';
import { authInterceptor } from 'src/core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideErrorHandling(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([publicInterceptor, authInterceptor])),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    { provide: StorageSource, useClass: LocalStorageServiceImp },
    provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({ prefix: '/assets/i18n/', suffix: '.json' }),
    }),
    provideAuthDI(),
    provideProductsDI(),
    provideCartDI(),
  ],
};
