import { TokensDbo } from '../local/dbo/auth.dbo';

export abstract class AuthLocalDataSource {
  abstract saveTokens(tokens: TokensDbo): void;
  abstract getAccessToken(): string | null;
  abstract getRefreshToken(): string | null;
  abstract clearTokens(): void;
}
