import { Inject, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class ProductRepository{
  constructor (@Inject() private prismaService:PrismaService) {
  }

  async createNewProduct(data : Prisma.ProductCreateInput):Promise<void>{
    await this.prismaService.product.create({
      data: data
    })
  }
}