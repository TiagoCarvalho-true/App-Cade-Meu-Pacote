import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksService } from './webhooks.service';
import { PrismaService } from 'src/common/database/prisma.service';
import { Logger } from '@nestjs/common';

describe('WebhooksService', () => {
  let service: WebhooksService;
  let prisma: PrismaService;
  let logger: Logger;

  const mockPrismaService = {
    package: {
      updateMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhooksService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<WebhooksService>(WebhooksService);
    prisma = module.get<PrismaService>(PrismaService);
    logger = (service as any).logger;

    jest.clearAllMocks();
    jest.spyOn(logger, 'warn').mockImplementation(() => {});
    jest.spyOn(logger, 'log').mockImplementation(() => {});
    jest.spyOn(logger, 'error').mockImplementation(() => {});
  });

  it('deve registrar aviso e retornar se payload não contiver msg', async () => {
    const result = await service.handleAfterShipUpdate({});

    expect(logger.warn).toHaveBeenCalledWith(
      'Webhook recebido, mas sem dados em "msg".',
    );
    expect(result).toBeUndefined();
    expect(prisma.package.updateMany).not.toHaveBeenCalled();
  });

  it('deve atualizar pacotes com sucesso e registrar logs', async () => {
    const payload = {
      msg: {
        tracking_number: 'AB123456BR',
        tag: 'Delivered',
        checkpoints: [{ status: 'Entregue' }],
      },
    };

    mockPrismaService.package.updateMany.mockResolvedValue({ count: 3 });

    const result = await service.handleAfterShipUpdate(payload);

    expect(logger.log).toHaveBeenCalledWith(
      `Atualizando pacote: AB123456BR -> Delivered`,
    );
    expect(logger.log).toHaveBeenCalledWith(
      `3 pacotes atualizados com o código AB123456BR.`,
    );
    expect(prisma.package.updateMany).toHaveBeenCalledWith({
      where: { trackingCode: 'AB123456BR' },
      data: {
        status: 'Delivered',
        timeline: payload.msg.checkpoints,
        updatedAt: expect.any(Date),
      },
    });
    expect(result).toEqual({ success: true, updated: 3 });
  });

  it('deve registrar erro e retornar sucesso falso se o update falhar', async () => {
    const payload = {
      msg: {
        tracking_number: 'XYZ999',
        tag: 'InTransit',
        checkpoints: [],
      },
    };

    mockPrismaService.package.updateMany.mockRejectedValue(
      new Error('Falha no banco'),
    );

    const result = await service.handleAfterShipUpdate(payload);

    expect(logger.error).toHaveBeenCalledWith(
      'Falha ao atualizar pacote via webhook: Falha no banco',
    );
    expect(result).toEqual({ success: false });
  });
});
