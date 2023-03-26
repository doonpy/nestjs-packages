import type { Type } from '@nestjs/common';

export interface PrismaUnitOfWorkModuleOptions {
  global?: boolean;
  prismaClient: Type<PrismaClientPrototype>;
}

export interface PrismaClientPrototype {
  $transaction<R>(
    fn: (
      prisma: Omit<
        object,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
      >
    ) => Promise<R>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: any;
    }
  ): Promise<R>;
}
