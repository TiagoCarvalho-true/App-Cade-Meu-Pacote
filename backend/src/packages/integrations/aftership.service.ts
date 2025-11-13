
import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface AfterShipTrackingData {
  status: string;
  timeline: any[]; // A API retorna um array de eventos de rastreio
}

@Injectable()
export class AfterShipService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.aftership.com/v4';
  private readonly logger = new Logger(AfterShipService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {this.apiKey = this.configService.getOrThrow('AFTERSHIP_API_KEY');}

  /**
   * Tenta registrar um novo código de rastreio na plataforma do AfterShip.
   * O AfterShip tentará detectar a transportadora automaticamente.
   */
  async createTracking(
    trackingCode: string,
  ): Promise<AfterShipTrackingData> {

    // Define o 'body' da requisição POST
    const payload = {
      tracking: {
        tracking_number: trackingCode,
      },
    };

    // Define os 'headers' com nossa API Key
    const config = {
      headers: {
        'aftership-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
    };

    try {
      const response$ = this.httpService.post(
        `${this.baseUrl}/trackings`,
        payload,
        config,
      );

      // Converte o Observable (padrão do HttpService) para uma Promise
      const response = await firstValueFrom(response$);
      const trackingData = response.data.data.tracking;

      // Retorna os dados que nosso PackagesService precisa
      return {
        status: trackingData.tag, // Ex: "InTransit", "Delivered"
        timeline: trackingData.checkpoints || [], // Histórico de eventos
      };

    } catch (error) {
      this.logger.error(
        `Falha ao rastrear código: ${error.response?.data?.meta?.message}`,
        error.stack,
      );

      // Se a API retornar um erro de "não encontrado"
      if (error.response?.data?.meta?.code === 4004) {
        throw new NotFoundException(
          'Código de rastreio não encontrado ou inválido.',
        );
      }

      // Para outros erros
      throw new InternalServerErrorException(
        'Não foi possível iniciar o rastreamento deste pacote.',
      );
    }
  }
  async deleteTracking(trackingCode: string): Promise<void> {
    const config = {
      headers: { 'aftership-api-key': this.apiKey },
    };

    // O AfterShip identifica o pacote pelo 'tracking_number'
    const slug = 'autodetect'; // Usamos autodetect, pois não salvamos o 'slug'

    try {
      const response$ = this.httpService.delete(
        `${this.baseUrl}/trackings/${slug}/${trackingCode}`,
        config,
      );
      await firstValueFrom(response$);
      this.logger.log(`Rastreio ${trackingCode} deletado do AfterShip.`);
    } catch (error) {
      // Se der erro (ex: 404, já deletado), apenas registramos o log.
      // O importante é deletar do nosso banco de qualquer forma.
      this.logger.warn(
        `Falha ao deletar ${trackingCode} do AfterShip: ${error.message}`,
      );
    }
  }
}