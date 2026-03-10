export class AppError extends Error {
  constructor(
    public readonly messageKey: string,
    public readonly context?: Record<string, string>,
  ) {
    super(messageKey);
  }
}

export class NetworkError extends AppError {}
export class NotFoundError extends AppError {}
export class UnauthorizedError extends AppError {}
export class ServerError extends AppError {}
