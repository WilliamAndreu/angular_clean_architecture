import { AppError } from 'src/domain/errors/app-error';
import { ErrorHandlingContext } from 'src/core/models/interfaces/error/error-handling-context.interface';
export abstract class ErrorHandlingSource {
  abstract handle(error: unknown, context?: ErrorHandlingContext): AppError;
}
