import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from 'src/users/dto/google-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body(new ValidationPipe()) dto: LoginDto) {
    return this.authService.login(dto);
  }
  @Post('google')
  googleLogin(@Body(new ValidationPipe()) dto: GoogleLoginDto) {
    return this.authService.loginWithGoogle(dto.token);
  }
}