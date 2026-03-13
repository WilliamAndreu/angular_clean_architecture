import { Routes } from '@angular/router';
import { authGuard } from 'src/core/guards/auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('@layouts/public-layout/public-layout').then((m) => m.PublicLayout),
    loadChildren: () =>
      import('@layouts/public-layout/public-layout.routes').then((m) => m.PUBLIC_LAYOUT_ROUTES),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@layouts/private-layout/private-layout').then((m) => m.PrivateLayout),
    loadChildren: () =>
      import('@layouts/private-layout/private-layout.routes').then((m) => m.PRIVATE_LAYOUT_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
