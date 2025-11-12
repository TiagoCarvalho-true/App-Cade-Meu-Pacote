import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

// ✅ Mock global do bcrypt precisa vir aqui, fora do describe
jest.mock('bcrypt', () => ({
  hash: jest.fn(async () => 'hashed'),
  compare: jest.fn(async () => true),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  const now = new Date();

  const mockUser: User = {
    id: '1',
    email: 'user_teste@email.com',
    name: 'User Teste',
    password: 'hashed',
    provider: 'EMAIL',
    createdAt: now,
    updatedAt: now,
  };

  const mockRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um novo usuário com sucesso', async () => {
      const dto = { email: 'user_teste@email.com', name: 'User Teste', password: '123' };
      repository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      const createdUser: User = { ...mockUser };
      repository.create.mockResolvedValue(createdUser);

      const result = await service.create(dto);

      expect(repository.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(repository.create).toHaveBeenCalledWith(dto, 'hashed', 'EMAIL');
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        provider: 'EMAIL',
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('deve lançar ConflictException se o email já existir', async () => {
      repository.findByEmail.mockResolvedValue(mockUser);
      const dto = { email: mockUser.email, name: mockUser.name, password: '123' };

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findOrCreateGoogleUser', () => {
    it('deve retornar usuário existente com provider GOOGLE', async () => {
      const googleUser: User = { ...mockUser, provider: 'GOOGLE' };
      repository.findByEmail.mockResolvedValue(googleUser);

      const result = await service.findOrCreateGoogleUser(googleUser.email, googleUser.name);
      expect(result).toEqual(googleUser);
    });

    it('deve lançar ConflictException se usuário existir com provider EMAIL', async () => {
      repository.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.findOrCreateGoogleUser(mockUser.email, mockUser.name),
      ).rejects.toThrow(ConflictException);
    });

    it('deve criar novo usuário se não existir', async () => {
      repository.findByEmail.mockResolvedValue(null);

      const created: User = {
        id: '2',
        email: 'novo@email.com',
        name: 'User Teste',
        provider: 'GOOGLE',
        password: null,
        createdAt: now,
        updatedAt: now,
      };

      repository.create.mockResolvedValue(created);

      const result = await service.findOrCreateGoogleUser('novo@email.com', 'User Teste');

      expect(repository.create).toHaveBeenCalledWith(
        { email: 'novo@email.com', name: 'User Teste', password: '' },
        null,
        'GOOGLE',
      );
      expect(result).toEqual(created);
    });
  });

  describe('findByEmailForAuth', () => {
    it('deve retornar o usuário encontrado', async () => {
      repository.findByEmail.mockResolvedValue(mockUser);
      const result = await service.findByEmailForAuth(mockUser.email);
      expect(result).toBe(mockUser);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os usuários', async () => {
      const users: User[] = [mockUser, { ...mockUser, id: '2', email: 'x@x.com' }];
      repository.findAll.mockResolvedValue(users);
      const result = await service.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('deve retornar o usuário pelo id', async () => {
      repository.findById.mockResolvedValue(mockUser);
      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('deve atualizar e retornar o usuário', async () => {
      const updated: User = { ...mockUser, name: 'User Atualizado' };
      repository.update.mockResolvedValue(updated);
      const result = await service.update('1', { name: 'User Atualizado' });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('deve remover e retornar o resultado', async () => {
      const deleteResult = { count: 1 };
      repository.delete.mockResolvedValue(deleteResult as any);
      const result = await service.remove('1');
      expect(result).toEqual(deleteResult);
    });
  });
});
