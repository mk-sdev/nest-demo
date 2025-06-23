// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // ← dzięki temu nie trzeba importować w każdym module
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
