import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { Package } from '@prisma/client';
import { AfterShipTrackingData } from './integrations/aftership.service';

@Injectable()
export class PackagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo pacote associado a um usuário.
   */
  async create(
    dto: CreatePackageDto,
    userId: string,
    trackingData: AfterShipTrackingData, // <-- 1. Deve aceitar o 3º argumento
  ): Promise<Package> {
    return this.prisma.package.create({
      data: {
        name: dto.name,
        trackingCode: dto.trackingCode,
        
        // --- 2. Deve usar os dados de 'trackingData' ---
        status: trackingData.status,
        timeline: trackingData.timeline as any, // (O Prisma espera 'JsonValue')
        // ------------------------------------

        userId: userId,
      },
    });
  }
  /**
   * Lista todos os pacotes de um usuário específico.
   */
  async findAllByUserId(userId: string): Promise<Package[]> {
    return this.prisma.package.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  /**
   * Busca um pacote pelo 'trackingCode' e 'userId'.
   */
  async findByUserAndCode(
    userId: string,
    trackingCode: string,
  ): Promise<Package | null> {
    return this.prisma.package.findUnique({
      where: {
        userId_trackingCode: {
          userId: userId,
          trackingCode: trackingCode,
        },
      },
    });
  }
  async findByIdAndUserId(
    packageId: string,
    userId: string,
  ): Promise<Package | null> {
    return this.prisma.package.findUnique({
      where: {
        id: packageId,
        userId: userId, // Garante que o pacote pertence a este usuário
      },
    });
  }
  async updateName(
    packageId: string,
    name: string,
  ): Promise<Package> {
    return this.prisma.package.update({
      where: {
        id: packageId,
      },
      data: {
        name: name,
      },
    });
  }
  async remove(packageId: string): Promise<void> {
    await this.prisma.package.delete({
      where: {
        id: packageId,
      },
    });
  }
}