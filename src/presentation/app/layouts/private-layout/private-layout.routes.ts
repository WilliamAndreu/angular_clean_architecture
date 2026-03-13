import { Routes } from '@angular/router';
import { provideAuthDI } from '@di/auth.di';

export const PRIVATE_LAYOUT_ROUTES: Routes = [
  {
    path: '',
    providers: [provideAuthDI()],
    loadComponent: () =>
      import('@views/user-detail-view/user-detail-view').then((m) => m.UserDetailView),
  },
];
