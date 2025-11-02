import { Injectable,ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(dto: CreateUserDto){
    // 1. Lógica: Verificar se o email já existe
    const existingUser = await this.repository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Um usuário com este email já existe.');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
    // 3. Chamar o repositório para salvar no banco
    const user = await this.repository.create(dto, hashedPassword);
    return user;

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
