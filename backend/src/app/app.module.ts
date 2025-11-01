import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { PackagesModule } from '../packages/packages.module';
import {ConfigModule} from '@nestjs/config';
import { PrismaModule } from '../common/database/prisma.module';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
     PrismaModule,
      UsersModule,
       PackagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


