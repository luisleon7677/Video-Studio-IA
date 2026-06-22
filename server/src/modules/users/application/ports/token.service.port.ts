export interface AuthTokenPayload {
  userId: number;
  email: string;
}

export abstract class TokenService {
  abstract sign(payload: AuthTokenPayload): string;
  abstract verify(token: string): AuthTokenPayload | null;
}
