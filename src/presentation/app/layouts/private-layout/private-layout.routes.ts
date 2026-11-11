import { Routes } from '@angular/router';

export const PRIVATE_LAYOUT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@views/user-detail-view/user-detail-view').then((m) => m.UserDetailView),
  },
];
