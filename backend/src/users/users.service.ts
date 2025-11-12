import { Injectable,ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';


@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.repository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Um usuário com este email já existe.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    // PASSA O NOVO CAMPO 'provider'
    const user = await this.repository.create(dto, hashedPassword, 'EMAIL');

    const { password, ...result } = user;
    return result;
  }
  async findOrCreateGoogleUser(
    email: string,
    name: string,
  ): Promise<User> {
    const user = await this.repository.findByEmail(email);

    // Se o usuário já existe
    if (user) {
      // Se ele se cadastrou por email, damos erro
      if (user.provider === 'EMAIL') {
        throw new ConflictException(
          'Este email já está cadastrado. Use seu email e senha para logar.',
        );
      }
      // Se for 'GOOGLE', apenas retornamos o usuário
      return user;
    }

    // Se não existe, cria um novo usuário do Google (sem senha)
    // Usamos um DTO "falso"
    const dto: CreateUserDto = { email, name, password: '' };
    return this.repository.create(dto, null, 'GOOGLE');
  }
  async findByEmailForAuth(email:string){
    return await this.repository.findByEmail(email)
  }
  async findAll() {
    return await this.repository.findAll()
  }
 
  async findOne(id: string) {
    return await this.repository.findById(id) ;
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.repository.update(id, updateUserDto);
  }
  async remove(id: string) {
    return await this.repository.delete(id);
  }
}
