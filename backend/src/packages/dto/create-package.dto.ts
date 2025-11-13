
import { IsString, IsNotEmpty } from 'class-validator';
export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  name: string; 
  @IsString()
  @IsNotEmpty()
  trackingCode: string; 
}
