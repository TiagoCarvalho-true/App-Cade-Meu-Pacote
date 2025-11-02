// src/modules/webhooks/webhooks.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  // Injeta o PrismaService (que é global)
  constructor(private readonly prisma: PrismaService) {}

  async handleAfterShipUpdate(payload: any) {
    // O payload do AfterShip é um pouco complexo,
    // os dados do pacote vêm dentro de 'msg'
    const trackingData = payload.msg;

    if (!trackingData) {
      this.logger.warn('Webhook recebido, mas sem dados em "msg".');
      return;
    }

    const trackingCode = trackingData.tracking_number;
    const newStatus = trackingData.tag; // Ex: "Delivered"
    const newTimeline = trackingData.checkpoints || []; // Array de eventos

    this.logger.log(`Atualizando pacote: ${trackingCode} -> ${newStatus}`);

    try {
      // ATENÇÃO:
      // Atualiza TODOS os pacotes no banco que tenham esse código.
      // (Lembre-se: múltiplos usuários podem rastrear o mesmo código)
      const updateResult = await this.prisma.package.updateMany({
        where: {
          trackingCode: trackingCode,
        },
        data: {
          status: newStatus,
          timeline: newTimeline as any, // Converte para 'JsonValue'
          updatedAt: new Date(), // Força a atualização do 'updatedAt'
        },
      });

      this.logger.log(
        `${updateResult.count} pacotes atualizados com o código ${trackingCode}.`,
      );

      return { success: true, updated: updateResult.count };

    } catch (error) {
      this.logger.error(
        `Falha ao atualizar pacote via webhook: ${error.message}`,
      );
      return { success: false };
    }
  }
}