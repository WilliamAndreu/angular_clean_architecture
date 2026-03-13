import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageSource } from 'src/core/services/storage/source/storage-source.interface';

export const guestGuard: CanActivateFn = () => {
  const storage = inject(StorageSource);
  const router = inject(Router);

  return storage.get<string>('access_token') ? router.createUrlTree(['/profile']) : true;
};
