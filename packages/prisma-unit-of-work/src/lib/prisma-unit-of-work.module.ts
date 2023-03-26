import { Global, Module } from '@nestjs/common';
import { ClsInterceptor, ClsModule } from 'nestjs-cls';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({ interceptor: { generateId: true, mount: true } }),
  ],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ClsInterceptor,
    },
  ],
  exports: [],
})
export class PrismaUnitOfWorkModule {}
