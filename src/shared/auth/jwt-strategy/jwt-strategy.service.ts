import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { ConfigurationService } from '../../configuration/configuration.service';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { Configuration } from '../../configuration/configuration.enum';
import { JwtPayload } from '../jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(private readonly authService: AuthService,
              private readonly configurationService: ConfigurationService,
  ) {
   super({
     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
     secretOrKey: configurationService.get(Configuration.JWT_KEY),
   });
  }
  async validate(payload: JwtPayload, done: VerifiedCallback ){
    const user = await this.authService.validateUser(payload);
    if (!user) {
      // @ts-ignore
      return done(new HttpException({}, HttpStatus.UNAUTHORIZED), false);
    }
    return done(null, user, payload.iat);
  }
}
