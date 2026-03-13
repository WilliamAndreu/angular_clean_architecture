import { Routes } from '@angular/router';
import { provideProductsDI } from '@di/products.di';
import { provideAuthDI } from '@di/auth.di';
import { guestGuard } from 'src/core/guards/guest.guard';

export const PUBLIC_LAYOUT_ROUTES: Routes = [
  {
    path: '',
    providers: [provideProductsDI()],
    loadComponent: () =>
      import('@views/products-list-view/products-list-view').then((m) => m.ProductsListView),
  },
  {
    path: 'products/:id',
    providers: [provideProductsDI()],
    loadComponent: () =>
      import('@views/product-detail-view/product-detail-view').then((m) => m.ProductDetailView),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    providers: [provideAuthDI()],
    loadComponent: () => import('@views/login-view/login-view').then((m) => m.LoginView),
  },
];
