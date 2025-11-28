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
  HttpCode,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@UseGuards(JwtAuthGuard)
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) { }

  @Post()
  create(
    @Body(new ValidationPipe()) dto: CreatePackageDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.packagesService.create(dto, userId);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.id;
    return this.packagesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') packageId: string, @Request() req) {
    const userId = req.user.id;
    return this.packagesService.findOne(packageId, userId);
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
  @HttpCode(204)
  remove(
    @Param('id') packageId: string,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.packagesService.remove(packageId, userId);
  }
}