import { AppErrorOptions, NotFoundError } from 'src/domain/errors/app-error';
export class ProductNotFoundError extends NotFoundError {
  constructor(
    messageKey = 'errors.products.not_found',
    context?: Readonly<Record<string, string>>,
    options: AppErrorOptions = {},
  ) {
    super(messageKey, context, { code: 'PRODUCT_NOT_FOUND', ...options });
  }
}
