import jwt, { type SignOptions } from 'jsonwebtoken';
import {
  AuthTokenPayload,
  TokenService,
} from '../../application/ports/token.service.port';

const DEFAULT_EXPIRES_IN = '7d' as const;

export class JwtTokenService implements TokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: SignOptions['expiresIn'] = DEFAULT_EXPIRES_IN,
  ) {
    if (!secret) {
      throw new Error('JWT_SECRET no está configurado');
    }
  }

  sign(payload: AuthTokenPayload): string {
    const options: SignOptions = { expiresIn: this.expiresIn };
    return jwt.sign(payload, this.secret, options);
  }

  verify(token: string): AuthTokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret);
      if (typeof decoded !== 'object' || decoded === null) return null;

      const payload = decoded as Partial<AuthTokenPayload>;
      if (typeof payload.userId !== 'number' || typeof payload.email !== 'string') {
        return null;
      }

      return { userId: payload.userId, email: payload.email };
    } catch {
      return null;
    }
  }
}
