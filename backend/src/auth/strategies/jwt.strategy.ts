
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }


  /**
   *    // Define como o token será extraído (do Header "Bearer <token>")
   * O Passport decodifica o token, valida a assinatura e chama este método.
   * O que retornamos aqui será injetado no 'request.user'
   */
  async validate(payload: any) {
    // payload = { sub: user.id, email: user.email, name: user.name }
    return { id: payload.sub, email: payload.email, name: payload.name };
  }
}