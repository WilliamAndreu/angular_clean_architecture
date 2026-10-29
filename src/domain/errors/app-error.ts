export type ErrorKind =
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'not-found'
  | 'conflict'
  | 'network'
  | 'timeout'
  | 'rate-limit'
  | 'server'
  | 'unexpected';
export interface AppErrorOptions {
  code?: string;
  kind?: ErrorKind;
  retryable?: boolean;
  cause?: unknown;
}

/** Portable error contract. No HTTP response, Angular type or translated text. */
export class AppError extends Error {
  readonly code: string;
  readonly kind: ErrorKind;
  /** Indicates that a user-initiated retry may help; never authorizes automatic retries. */
  readonly retryable: boolean;
  readonly context?: Readonly<Record<string, string>>;
  constructor(
    public readonly messageKey: string,
    context?: Readonly<Record<string, string>>,
    options: AppErrorOptions = {},
  ) {
    super(messageKey, { cause: options.cause });
    this.name = new.target.name;
    this.code = options.code ?? 'UNEXPECTED';
    this.kind = options.kind ?? 'unexpected';
    this.retryable = options.retryable ?? false;
    this.context = context ? Object.freeze({ ...context }) : undefined;
  }
}

export class NetworkError extends AppError {
  constructor(
    messageKey = 'errors.network',
    context?: Readonly<Record<string, string>>,
    options: AppErrorOptions = {},
  ) {
    super(messageKey, context, { code: 'NETWORK', kind: 'network', retryable: true, ...options });
  }
}

export class BadRequestError extends AppError {
  constructor(
    messageKey = 'errors.validation',
    context?: Readonly<Record<string, string>>,
    options: AppErrorOptions = {},
  ) {
    super(messageKey, context, {
      code: 'VALIDATION',
      kind: 'validation',
      retryable: false,
      ...options,
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    messageKey = 'errors.unauthorized',
    context?: Readonly<Record<string, string>>,
    options: AppErrorOptions = {},
  ) {
    super(messageKey, context, {
      code: 'UNAUTHENTICATED',
      kind: 'authentication',
      retryable: false,
      ...options,
    });
  }
}

export class ForbiddenError extends AppError {
  constructor(
    messageKey = 'errors.forbidden',
    context?: Readonly<Record<string, string>>,
    options: AppErrorOptions = {},
  ) {
    super(messageKey, context, {
      code: 'FORBIDDEN',
      kind: 'authorization',
      retryable: false,
      ...options,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(
    messageKey = 'errors.not_found',
    context?: Readonly<Record<string, string>>,
    options: AppErrorOptions = {},
  ) {
    super(messageKey, context, {
      code: 'NOT_FOUND',
      kind: 'not-found',
      retryable: false,
      ...options,
    });
  }
}

export class ConflictError extends AppError {
  constructor(
    messageKey = 'errors.conflict',
    context?: Readonly<Record<string, string>>,
    options: AppErrorOptions = {},
  ) {
    super(messageKey, context, {
      code: 'CONFLICT',
      kind: 'conflict',
      retryable: false,
      ...options,
    });
  }
}

export class TimeoutError extends AppError {
  constructor(
    messageKey = 'errors.timeout',
    context?: Readonly<Record<string, string>>,
    options: AppErrorOptions = {},
  ) {
    super(messageKey, context, { code: 'TIMEOUT', kind: 'timeout', retryable: true, ...options });
  }
}

export class RateLimitError extends AppError {
  constructor(
    messageKey = 'errors.rate_limit',
    context?: Readonly<Record<string, string>>,
    options: AppErrorOptions = {},
  ) {
    super(messageKey, context, {
      code: 'RATE_LIMIT',
      kind: 'rate-limit',
      retryable: true,
      ...options,
    });
  }
}

export class ServerError extends AppError {
  constructor(
    messageKey = 'errors.server',
    context?: Readonly<Record<string, string>>,
    options: AppErrorOptions = {},
  ) {
    super(messageKey, context, { code: 'SERVER', kind: 'server', retryable: true, ...options });
  }
}

export class UnexpectedError extends AppError {
  constructor(
    messageKey = 'errors.unknown',
    context?: Readonly<Record<string, string>>,
    options: AppErrorOptions = {},
  ) {
    super(messageKey, context, {
      code: 'UNEXPECTED',
      kind: 'unexpected',
      retryable: false,
      ...options,
    });
  }
}

/** Unknown thrown values never become user-facing strings. Typed errors retain identity. */
export function toAppError(error: unknown, fallbackKey = 'errors.unknown'): AppError {
  return error instanceof AppError
    ? error
    : new UnexpectedError(fallbackKey, undefined, { cause: error });
}
