// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(dto: LoginDto): Promise<any> {
    const user = await this.usersService.findByEmailForAuth(dto.email);

    if (user && (await bcrypt.compare(dto.password, user.password))) {
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

    return {
      access_token: this.jwtService.sign(payload),
      user: payload, // Retorna os dados do usuário para o App
    };
  }
}