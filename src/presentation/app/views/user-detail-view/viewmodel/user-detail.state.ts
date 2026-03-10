import { signal } from '@angular/core';
import { UserEntity } from '@models/auth/auth-entity.model';

export class UserDetailState {
  readonly user = signal<UserEntity | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
}
