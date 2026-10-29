import { handleOperation } from 'src/domain/errors/handle-operation';
import { Observable } from 'rxjs';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { UseCase } from 'src/domain/interfaces/use-case';

export class RestoreSessionUseCase implements UseCase<void, boolean> {
  constructor(private readonly repo: AuthRepository) {}
  execute(): Observable<boolean> {
    return handleOperation(() => this.repo.restoreSession());
  }
}
