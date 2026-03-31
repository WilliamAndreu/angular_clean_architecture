export interface LoginCredentialsEntity {
  username: string;
  password: string;
}

export interface LoginEntity {
  accessToken: string;
  refreshToken: string;
  user: UserEntity;
}

export interface UserEntity {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface TokensEntity {
  accessToken: string;
  refreshToken: string;
}
