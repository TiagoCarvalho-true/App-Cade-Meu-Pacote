// src/modules/webhooks/webhooks.controller.ts

import { Body, Controller, Logger, Post } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks') // Rota base: /webhooks
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  /**
   * Rota pública que o AfterShip vai chamar
   * URL completa: https://<URL_NGROK>/webhooks/aftership-update
   */
  @Post('aftership-update')
  async handleAfterShipUpdate(@Body() payload: any) {
    this.logger.log('Novo Webhook do AfterShip recebido!');

    // Simplesmente repassa o payload (JSON) para o nosso serviço
    return this.webhooksService.handleAfterShipUpdate(payload);
  }
}