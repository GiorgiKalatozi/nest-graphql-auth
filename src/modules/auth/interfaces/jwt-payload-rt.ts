import { IJwtPayload } from './jwt-payload';

export interface IJwtPayloadWithRefreshToken extends IJwtPayload {
  accessToken: string;
}
