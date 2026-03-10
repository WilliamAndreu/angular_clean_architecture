import { TokensEntity } from '@models/auth/auth-entity.model';

export abstract class AuthLocalDataSource {
  abstract saveTokens(tokens: TokensEntity): void;
  abstract getAccessToken(): string | null;
  abstract getRefreshToken(): string | null;
  abstract clearTokens(): void;
}
