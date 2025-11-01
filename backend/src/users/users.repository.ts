
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/database/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}
    async create(dto:CreateUserDto,hashPassword:string  ){
     return this.prisma.user.create({
    data:{
        ...dto,
        password:hashPassword
    },
    select:{
       email:true
    }})
    }

    async  findByEmail(email:string){
        return this.prisma.user.findUnique({
            where:{
                email:email
            }
        })
    }
    async findById(id:string){
        return this.prisma.user.findUnique({
            where:{
                id:id
            }
        })
    }
    async delete(id:string){
        return this.prisma.user.delete({
            where:{
                id:id
            }
        })
    }
    async findAll(){
        return this.prisma.user.findMany()
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
