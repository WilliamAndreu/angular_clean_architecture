import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageSource } from 'src/core/services/storage/source/storage-source.interface';

export const authGuard: CanActivateFn = () => {
  const storage = inject(StorageSource);
  const router = inject(Router);

  return storage.get<string>('access_token') ? true : router.createUrlTree(['/login']);
};
