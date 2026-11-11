import { authGuard } from '@guards/auth.guard';
import { Routes } from '@angular/router';
import { guestGuard } from 'src/core/guards/guest.guard';

export const PUBLIC_LAYOUT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@views/products-list-view/products-list-view').then((m) => m.ProductsListView),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('@views/product-detail-view/product-detail-view').then((m) => m.ProductDetailView),
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () => import('@views/cart-view/cart-view').then((m) => m.CartView),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('@views/login-view/login-view').then((m) => m.LoginView),
  },
];
