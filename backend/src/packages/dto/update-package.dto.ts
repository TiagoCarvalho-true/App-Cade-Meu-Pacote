

import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePackageDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional() 
  name?: string;
}