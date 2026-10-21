import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg'; 

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 1. Tạo một connection pool kết nối tới PostgreSQL
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL 
    });
    
    // 2. Khởi tạo PrismaPg adapter theo chuẩn Prisma v7
    const adapter = new PrismaPg(pool);

    // 3. Truyền adapter vào constructor của lớp cha PrismaClient
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Giải phóng kết nối khi đóng ứng dụng
  }
}
