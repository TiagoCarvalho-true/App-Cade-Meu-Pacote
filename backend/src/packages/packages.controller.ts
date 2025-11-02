
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards, 
  Request,
  ValidationPipe,
  Param,
  Patch,
  Delete,
  HttpCode
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@UseGuards(JwtAuthGuard)
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  create(
    @Body(new ValidationPipe()) dto: CreatePackageDto,
    @Request() req, // <-- Pegamos a requisição HTTP inteira
  ) {
    // O 'req.user' foi injetado pela nossa JwtStrategy
    // Ele contém { id: ..., email: ..., name: ... }
    const userId = req.user.id;
    return this.packagesService.create(dto, userId);
  }

  @Get()
  findAll(@Request() req) {
    // O 'req.user' também está disponível aqui
    const userId = req.user.id;
    return this.packagesService.findAll(userId);
  }
  @Patch(':id')
  update(
    @Param('id') packageId: string, 
    @Body(new ValidationPipe()) dto: UpdatePackageDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.packagesService.update(packageId, userId, dto);
  }
  @Delete(':id')
  @HttpCode(204) // Define o status de sucesso para "204 No Content"
  remove(
    @Param('id') packageId: string, // Pega o 'id' da URL
    @Request() req,
  ) {
    const userId = req.user.id;
    // Não precisa de 'return', o serviço retorna 'void'
    return this.packagesService.remove(packageId, userId);
  }
}