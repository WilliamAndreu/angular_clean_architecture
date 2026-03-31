export interface LoginRequestDto {
  username: string;
  password: string;
  expiresInMins: number;
}

export interface LoginDto {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface UserDto {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface TokensDto {
  accessToken: string;
  refreshToken: string;
}
