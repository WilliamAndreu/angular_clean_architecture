import { handleOperation } from 'src/domain/errors/handle-operation';
import { Observable } from 'rxjs';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { UseCase } from 'src/domain/interfaces/use-case';

export class LogoutUseCase implements UseCase<void, void> {
  constructor(private readonly repo: AuthRepository) {}
  execute(): Observable<void> {
    return handleOperation(() => this.repo.logout());
  }
}
