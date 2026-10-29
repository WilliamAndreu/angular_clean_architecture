import { AppError } from 'src/domain/errors/app-error';
import { ErrorReport } from 'src/core/models/interfaces/error/error-report.interface';
export type ErrorDiagnostics = (error: AppError) => ErrorReport['details'];
