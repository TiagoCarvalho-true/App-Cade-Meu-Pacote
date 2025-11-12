import { Test, TestingModule } from '@nestjs/testing';
import { PackagesService } from './packages.service';
import { PackagesRepository } from './packages.repository';
import { AfterShipService } from './integrations/aftership.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

describe('PackagesService', () => {
  let service: PackagesService;
  let repository: jest.Mocked<PackagesRepository>;
  let afterShipService: jest.Mocked<AfterShipService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PackagesService,
        {
          provide: PackagesRepository,
          useValue: {
            findByUserAndCode: jest.fn(),
            create: jest.fn(),
            findByIdAndUserId: jest.fn(),
            updateName: jest.fn(),
            findAllByUserId: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: AfterShipService,
          useValue: {
            createTracking: jest.fn(),
            deleteTracking: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PackagesService>(PackagesService);
    repository = module.get(PackagesRepository);
    afterShipService = module.get(AfterShipService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('deve criar um pacote com sucesso', async () => {
      const dto: CreatePackageDto = { trackingCode: 'ABC123', name: 'Pacote 1' };
      const userId = 'user-1';
      const trackingData = { id: 'track1' };
      const newPackage = { id: 'pkg1', trackingCode: 'ABC123', name: 'Pacote 1' } as any;

      repository.findByUserAndCode.mockResolvedValue(null);
      afterShipService.createTracking.mockResolvedValue(trackingData as any);
      repository.create.mockResolvedValue(newPackage);

      const result = await service.create(dto, userId);

      expect(repository.findByUserAndCode).toHaveBeenCalledWith(userId, dto.trackingCode);
      expect(afterShipService.createTracking).toHaveBeenCalledWith(dto.trackingCode);
      expect(repository.create).toHaveBeenCalledWith(dto, userId, trackingData);
      expect(result).toEqual(newPackage);
    });

    it('deve lançar erro se o pacote já estiver cadastrado', async () => {
      repository.findByUserAndCode.mockResolvedValue({ id: 'pkg1' } as any);

      await expect(
        service.create({ trackingCode: 'ABC123' } as any, 'user-1'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('deve atualizar o nome de um pacote', async () => {
      const pkg = { id: 'pkg1', name: 'Antigo' };
      const dto: UpdatePackageDto = { name: 'Novo nome' };
      const updatedPkg = { id: 'pkg1', name: 'Novo nome' };

      repository.findByIdAndUserId.mockResolvedValue(pkg as any);
      repository.updateName.mockResolvedValue(updatedPkg as any);

      const result = await service.update('pkg1', 'user-1', dto);

      expect(repository.findByIdAndUserId).toHaveBeenCalledWith('pkg1', 'user-1');
      expect(repository.updateName).toHaveBeenCalledWith('pkg1', 'Novo nome');
      expect(result).toEqual(updatedPkg);
    });

    it('deve retornar o pacote sem atualizar se não houver nome no DTO', async () => {
      const pkg = { id: 'pkg1', name: 'Sem mudança' };
      repository.findByIdAndUserId.mockResolvedValue(pkg as any);

      const result = await service.update('pkg1', 'user-1', {} as any);

      expect(result).toEqual(pkg);
    });

    it('deve lançar erro se o pacote não existir', async () => {
      repository.findByIdAndUserId.mockResolvedValue(null);

      await expect(
        service.update('pkg1', 'user-1', { name: 'Novo' } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os pacotes do usuário', async () => {
      const pkgs = [{ id: 'pkg1' }, { id: 'pkg2' }] as any;
      repository.findAllByUserId.mockResolvedValue(pkgs);

      const result = await service.findAll('user-1');

      expect(repository.findAllByUserId).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(pkgs);
    });
  });

  describe('remove', () => {
    it('deve remover um pacote existente', async () => {
      const pkg = { id: 'pkg1', trackingCode: 'ABC123' };
      repository.findByIdAndUserId.mockResolvedValue(pkg as any);

      await service.remove('pkg1', 'user-1');

      expect(afterShipService.deleteTracking).toHaveBeenCalledWith('ABC123');
      expect(repository.remove).toHaveBeenCalledWith('pkg1');
    });

    it('deve lançar erro se o pacote não for encontrado', async () => {
      repository.findByIdAndUserId.mockResolvedValue(null);

      await expect(service.remove('pkg1', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });
});
