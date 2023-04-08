import { Module } from '@nestjs/common';

import { PrismaUnitOfWorkModule } from '../lib/prisma-unit-of-work.module';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [PrismaUnitOfWorkModule.forRoot({ prismaClient: PrismaService })],
  controllers: [AppController],
})
export class AppModule {}
