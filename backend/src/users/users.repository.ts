
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/database/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    dto: CreateUserDto,
    hashedPassword: string | null, // <-- Aceita nulo
    provider: 'EMAIL' | 'GOOGLE', // <-- Aceita provider
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        provider: provider, // <-- Salva o provider
      },
    });
  }

    async findByEmail(email:string){
        return await this.prisma.user.findUnique({
            where:{
                email:email
            }
        })
    }
    async findById(id:string){
        return await this.prisma.user.findUnique({
            where:{
                id:id
            }
        })
    }
    async delete(id:string){
        return await this.prisma.user.delete({
            where:{
                id:id
            }
        })
    }
    async findAll(){
        return await this.prisma.user.findMany()
    }
    async update(id:string, dto:UpdateUserDto){
        return this.prisma.user.update({
            where:{id:id},
            data:{
                ...dto
            }
        })
    }
}
