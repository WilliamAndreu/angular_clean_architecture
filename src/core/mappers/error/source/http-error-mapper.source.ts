import { AppError } from 'src/domain/errors/app-error';
export abstract class HttpErrorMapperSource {
  abstract map(error: unknown): AppError;
}
