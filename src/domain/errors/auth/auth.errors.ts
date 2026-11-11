import { AppErrorOptions, UnauthorizedError } from 'src/domain/errors/app-error';
export class InvalidCredentialsError extends UnauthorizedError {
  constructor(
    messageKey = 'errors.auth.invalid_credentials',
    context?: Readonly<Record<string, string>>,
    options: AppErrorOptions = {},
  ) {
    super(messageKey, context, { code: 'AUTH_INVALID_CREDENTIALS', ...options });
  }
}
export class SessionExpiredError extends UnauthorizedError {
  constructor(
    messageKey = 'errors.auth.session_expired',
    context?: Readonly<Record<string, string>>,
    options: AppErrorOptions = {},
  ) {
    super(messageKey, context, { code: 'AUTH_SESSION_EXPIRED', ...options });
  }
}
