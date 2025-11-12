import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  UnauthorizedException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

// 🔹 Mock das dependências
const mockUsersService = {
  findByEmailForAuth: jest.fn(),
  findOrCreateGoogleUser: jest.fn(),
};
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const mockJwtService = {
  sign: jest.fn().mockReturnValue('fake-jwt-token'),
};

const mockConfigService = {
  getOrThrow: jest.fn().mockImplementation((key: string) => {
    if (key === 'GOOGLE_WEB_CLIENT_ID') return 'google-client-id';
    return null;
  }),
};

// 🔹 Mock do Google OAuth client
jest.mock('google-auth-library', () => {
  const verifyIdToken = jest.fn();
  return {
    OAuth2Client: jest.fn().mockImplementation(() => ({
      verifyIdToken,
    })),
  };
});

// 🔹 Mock do bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: typeof mockUsersService;
  let jwtService: typeof mockJwtService;
  let configService: typeof mockConfigService;
  let googleClient: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    googleClient = (service as any).googleClient;
    
  });

  // ===========================================================
  // validateUser
  // ===========================================================
  describe('validateUser', () => {
    it('deve retornar o usuário sem a senha se for válida', async () => {
      const mockUser = { id: 1, email: 'a@a.com', password: 'hashed', name: 'A' };
      usersService.findByEmailForAuth.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser({ email: 'a@a.com', password: '123' });
      expect(result).toEqual({ id: 1, email: 'a@a.com', name: 'A' });
    });

    it('deve retornar null se o usuário não existir', async () => {
      usersService.findByEmailForAuth.mockResolvedValue(null);
      const result = await service.validateUser({ email: 'x@x.com', password: '123' });
      expect(result).toBeNull();
    });

    it('deve retornar null se a senha for inválida', async () => {
      usersService.findByEmailForAuth.mockResolvedValue({ id: 1, password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser({ email: 'a@a.com', password: 'wrong' });
      expect(result).toBeNull();
    });
  });

  // ===========================================================
  // login
  // ===========================================================
  describe('login', () => {
    it('deve retornar token e usuário se for válido', async () => {
      const mockUser = { id: 1, email: 'a@a.com', name: 'A' };
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);

      const result = await service.login({ email: 'a@a.com', password: '123' });

      expect(result).toEqual({
        access_token: 'fake-jwt-token',
        user: { sub: 1, email: 'a@a.com', name: 'A' },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'a@a.com',
        name: 'A',
      });
    });

    it('deve lançar UnauthorizedException se o usuário for inválido', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login({ email: 'a@a.com', password: '123' }))
        .rejects
        .toBeInstanceOf(UnauthorizedException);
    });
  });

  // ===========================================================
  // generateInternalToken (privado)
  // ===========================================================
  describe('generateInternalToken', () => {
    it('deve gerar token JWT corretamente', async () => {
      const mockUser = { id: 10, email: 't@t.com', name: 'Tiago' } as any;
      const result = await (service as any).generateInternalToken(mockUser);

      expect(result).toEqual({
        access_token: 'fake-jwt-token',
        user: { sub: 10, email: 't@t.com', name: 'Tiago' },
      });
    });
  });

  // ===========================================================
  // loginWithGoogle
  // ===========================================================
  describe('loginWithGoogle', () => {
    it('deve logar e gerar token se Google for válido', async () => {
      const mockPayload = { email: 'g@g.com', name: 'GoogleUser' };
      (googleClient.verifyIdToken as jest.Mock).mockResolvedValue({
        getPayload: () => mockPayload,
      });
      usersService.findOrCreateGoogleUser.mockResolvedValue(mockPayload);

      const result = await service.loginWithGoogle('fake-id-token');

      expect(result.access_token).toBe('fake-jwt-token');
      expect(result.user.email).toBe('g@g.com');
      expect(usersService.findOrCreateGoogleUser).toHaveBeenCalledWith(
        'g@g.com',
        'GoogleUser',
      );
    });

    it('deve lançar UnauthorizedException se payload for inválido', async () => {
      (googleClient.verifyIdToken as jest.Mock).mockResolvedValue({
        getPayload: () => null,
      });

      await expect(service.loginWithGoogle('invalid-token'))
        .rejects
        .toBeInstanceOf(InternalServerErrorException);
    });

    it('deve lançar ConflictException se houver conflito no banco', async () => {
      const mockPayload = { email: 'x@x.com', name: 'X' };
      (googleClient.verifyIdToken as jest.Mock).mockResolvedValue({
        getPayload: () => mockPayload,
      });
      usersService.findOrCreateGoogleUser.mockRejectedValue(
        new ConflictException('Conflito'),
      );

      await expect(service.loginWithGoogle('fake-id-token'))
        .rejects
        .toBeInstanceOf(ConflictException);
    });

    it('deve lançar InternalServerErrorException se der erro genérico', async () => {
      (googleClient.verifyIdToken as jest.Mock).mockRejectedValue(
        new Error('Falha no Google'),
      );

      await expect(service.loginWithGoogle('fake-id-token'))
        .rejects
        .toBeInstanceOf(InternalServerErrorException);
    });
  });
});
