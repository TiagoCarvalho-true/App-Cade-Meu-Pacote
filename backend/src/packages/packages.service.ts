import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
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
  ) { }

  async create(dto: CreatePackageDto, userId: string): Promise<Package> {
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

    const newPackage = await this.repository.create(
      dto,
      userId,
      trackingData,
    );

    return newPackage;
  }

  async findAll(userId: string): Promise<Package[]> {
    return this.repository.findAllByUserId(userId);
  }

  async findOne(packageId: string, userId: string): Promise<Package> {
    const pkg = await this.repository.findByIdAndUserId(packageId, userId);
    if (!pkg) {
      throw new NotFoundException(
        'Pacote não encontrado ou não pertence a você.',
      );
    }
    return pkg;
  }

  async update(
    packageId: string,
    userId: string,
    dto: UpdatePackageDto,
  ): Promise<Package> {
    const pkg = await this.repository.findByIdAndUserId(packageId, userId);

    if (!pkg) {
      throw new NotFoundException(
        'Pacote não encontrado ou não pertence a você.',
      );
    }

    if (!dto.name) {
      return pkg;
    }

    return this.repository.updateName(packageId, dto.name);
  }

  async remove(packageId: string, userId: string): Promise<void> {
    const pkg = await this.repository.findByIdAndUserId(packageId, userId);

    if (!pkg) {
      throw new NotFoundException(
        'Pacote não encontrado ou não pertence a você.',
      );
    }

    await this.afterShipService.deleteTracking(pkg.trackingCode);
    await this.repository.remove(packageId);
  }
}