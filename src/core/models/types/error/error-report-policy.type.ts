import { AppError } from 'src/domain/errors/app-error';
import { ErrorHandlingContext } from 'src/core/models/interfaces/error/error-handling-context.interface';
export type ErrorReportPolicy = (error: AppError, context: ErrorHandlingContext) => boolean;
