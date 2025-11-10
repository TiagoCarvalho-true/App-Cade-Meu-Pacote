import { Injectable, UnauthorizedException, Logger,InternalServerErrorException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config'; 
import { OAuth2Client } from 'google-auth-library'; 
import { User } from '@prisma/client'; 
@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  private logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { this.googleClient = new OAuth2Client(
    this.configService.getOrThrow('GOOGLE_WEB_CLIENT_ID'),)}
    private async generateInternalToken(user: User) {
      const payload = {
        sub: user.id,
        email: user.email,
        name: user.name,
      };
      return {
        access_token: this.jwtService.sign(payload),
        user: payload,
      };
    }
  async validateUser(dto: LoginDto): Promise<any> {
    const user = await this.usersService.findByEmailForAuth(dto.email);

    if (user && (await bcrypt.compare(dto.password, <any>user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos.');
    }

    const payload = {
      sub: user.id, // 'sub' (subject) é o padrão para o ID do usuário
      email: user.email,
      name: user.name,
    };

    return this.generateInternalToken(user)
  }
  async loginWithGoogle(idToken: string) {
    try {
      // 1. Verifica o token no servidor do Google
      const ticket = await this.googleClient.verifyIdToken({
        idToken: idToken,
        audience: this.configService.getOrThrow('GOOGLE_WEB_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email || !payload.name) {
        throw new UnauthorizedException('Token do Google inválido');
      }

      // 2. Encontra ou cria o usuário no nosso banco
      const user = await this.usersService.findOrCreateGoogleUser(
        payload.email,
        payload.name,
      );

      // 3. Gera e retorna o NOSSO token JWT
      this.logger.log(`Usuário logado via Google: ${user.email}`);
      return this.generateInternalToken(user);
    } catch (error) {
      this.logger.error(`Falha no login Google: ${error.message}`, error.stack);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Falha ao processar login com Google.',
      );
    }
  }
}