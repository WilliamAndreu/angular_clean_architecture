import { Observable, of } from 'rxjs';
import { UseCase } from '@interface-core/use-case'; // Asegúrate de que la ruta sea correcta

export interface Params {
  id: number;
}

export interface Result {
  name: string;
}

export class MockUseCase implements UseCase<Params, Result> {
  execute(params: Params): Observable<Result> {
    return of({ name: `User ${params.id}` });
  }
}
