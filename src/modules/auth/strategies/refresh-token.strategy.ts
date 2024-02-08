import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtStrategyName } from '../enums';
import { IJwtPayloadRefreshToken } from '../interfaces';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  JwtStrategyName.JWT_REFRESH,
) {
  constructor(public readonly config: ConfigService) {
    super({
      // extract jwt from authorization header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // verify jwt signature
      secretOrKey: config.get('REFRESH_TOKEN_SECRET'),
      //   with this one we have access request object to validate method
      passReqToCallback: true,
    });
  }

  // this methods is called after jwt is decoded and verified
  public async validate(req: Request, payload: IJwtPayloadRefreshToken) {
    // payload contains info about the user

    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    return { ...payload, refreshToken };
  }
}
