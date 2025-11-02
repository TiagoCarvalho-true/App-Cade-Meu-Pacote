import { Injectable, ConflictException,NotFoundException } from '@nestjs/common';
import { PackagesRepository } from './packages.repository';
import { CreatePackageDto } from './dto/create-package.dto';
import { Package } from '@prisma/client';
import { AfterShipService } from './integrations/aftership.service'; 
import { UpdatePackageDto } from './dto/update-package.dto';

@Injectable()
export class PackagesService {
  constructor(
    private readonly repository: PackagesRepository,
    private readonly afterShipService: AfterShipService, 
  ) {}

 
  async create(dto: CreatePackageDto, userId: string,): Promise<Package> {
    // 1. Lógica: O usuário já cadastrou esse código?
    const existingPackage = await this.repository.findByUserAndCode(
      userId,
      dto.trackingCode,
    );
    if (existingPackage) {
      throw new ConflictException(
        'Você já está rastreando este código de pacote.',
      );
    }

   
    const trackingData = await this.afterShipService.createTracking(
      dto.trackingCode,
    );
    
    // 3. Salvar no banco
    // Passa os dados de rastreio para o repositório
    const newPackage = await this.repository.create(
      dto,
      userId,
      trackingData, // <-- 3. Passa os dados
    );
    
    return newPackage;
  }
  async update(
    packageId: string,
    userId: string,
    dto: UpdatePackageDto,
  ): Promise<Package> {
    // 1. Verifica se o pacote existe E pertence ao usuário
    const pkg = await this.repository.findByIdAndUserId(packageId, userId);

    if (!pkg) {
      throw new NotFoundException(
        'Pacote não encontrado ou não pertence a você.',
      );
    }

    // 2. Se o DTO não tiver um nome, apenas retorna o pacote
    if (!dto.name) {
      return pkg;
    }

    // 3. Se tiver, atualiza o nome
    return this.repository.updateName(packageId, dto.name);
  }
  async findAll(userId: string): Promise<Package[]> {
    return this.repository.findAllByUserId(userId);
  }
  async remove(packageId: string, userId: string): Promise<void> {
    // 1. Verifica se o pacote existe E pertence ao usuário
    const pkg = await this.repository.findByIdAndUserId(packageId, userId);

    if (!pkg) {
      throw new NotFoundException(
        'Pacote não encontrado ou não pertence a você.',
      );
    }

    // 2. Tenta deletar do AfterShip (para de receber webhooks)
    // Usamos o 'pkg.trackingCode' que pegamos do banco
    await this.afterShipService.deleteTracking(pkg.trackingCode);

    // 3. Deleta do nosso banco de dados
    await this.repository.remove(packageId);
  }
}