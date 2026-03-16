import { UnauthorizedError } from 'src/core/errors/app-error';

export class InvalidCredentialsError extends UnauthorizedError {}
export class SessionExpiredError extends UnauthorizedError {}
