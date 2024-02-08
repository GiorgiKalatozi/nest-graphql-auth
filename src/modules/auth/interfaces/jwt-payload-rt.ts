import { IJwtPayload } from './jwt-payload';

export interface IJwtPayloadRefreshToken extends IJwtPayload {
  refreshToken: string;
}
