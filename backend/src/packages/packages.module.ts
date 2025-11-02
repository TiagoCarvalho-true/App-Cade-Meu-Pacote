import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { PackagesRepository } from './packages.repository';
import { AfterShipService } from './integrations/aftership.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    HttpModule, 
  ],
  controllers: [PackagesController],
  providers: [
    PackagesService,
    PackagesRepository,
    AfterShipService,
  ],
})
export class PackagesModule {}