import { Test, TestingModule } from '@nestjs/testing';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { ExecutionContext } from '@nestjs/common';

describe('PackagesController', () => {
  let controller: PackagesController;
  let service: jest.Mocked<PackagesService>;

  const mockUser = { id: 'user-123', email: 'user@mail.com', name: 'Tiago' };
  const mockRequest = { user: mockUser };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackagesController],
      providers: [
        {
          provide: PackagesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockUser;
          return true;
        },
      })
      .compile();

    controller = module.get<PackagesController>(PackagesController);
    service = module.get(PackagesService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('deve criar um pacote chamando o serviço corretamente', async () => {
      const dto: CreatePackageDto = { trackingCode: 'ABC123', name: 'Pacote novo' };
      const expected = { id: 'pkg1', ...dto };

      service.create.mockResolvedValue(expected as any);

      const result = await controller.create(dto, mockRequest);

      expect(service.create).toHaveBeenCalledWith(dto, mockUser.id);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os pacotes do usuário', async () => {
      const expected = [{ id: 'pkg1' }, { id: 'pkg2' }];
      service.findAll.mockResolvedValue(expected as any);

      const result = await controller.findAll(mockRequest);

      expect(service.findAll).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('deve atualizar o pacote corretamente', async () => {
      const dto: UpdatePackageDto = { name: 'Atualizado' };
      const pkgId = 'pkg1';
      const expected = { id: pkgId, ...dto };

      service.update.mockResolvedValue(expected as any);

      const result = await controller.update(pkgId, dto, mockRequest);

      expect(service.update).toHaveBeenCalledWith(pkgId, mockUser.id, dto);
      expect(result).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('deve remover o pacote corretamente', async () => {
      const pkgId = 'pkg1';
      service.remove.mockResolvedValue(undefined);

      const result = await controller.remove(pkgId, mockRequest);

      expect(service.remove).toHaveBeenCalledWith(pkgId, mockUser.id);
      expect(result).toBeUndefined();
    });
  });
});
