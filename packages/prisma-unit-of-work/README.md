# Prisma Unit of Work

A simple NestJS module can help you wrap database queries in a single transaction using the Prisma ORM

## How it works?
Based on ["Interactive transaction"](https://www.prisma.io/docs/concepts/components/prisma-client/transactions#interactive-transactions), it starts a transaction with every request and stores the Prisma Client in Async Local Storage. In the request life cycle, you can retrieve this client and execute database queries within a transaction.

## Install
```
npm install --save @doonpy/prisma-unit-of-work
```

## Usage
### Import `PrismaUnitOfWorkModule` to your application module
You must generate your `PrismaClient` from Prisma schema.
```typescript
@Module({
  imports: [PrismaUnitOfWorkModule.forRoot({ prismaClient: PrismaService })],
  controllers: [AppController],
})
export class AppModule {}
```

### Binding `PrismaUnitOfWorkInterceptor`
Interceptor is required for start a transaction with every request from client
- Controller scope
```typescript
@UseInterceptors(PrismaUnitOfWorkInterceptor)
@Controller()
export class AppController {}
```

- Global scope
```typescript
const app = await NestFactory.create(AppModule);
app.useGlobalInterceptors(app.get(PrismaUnitOfWorkInterceptor));
```

### Retrieve the Prisma Client from Async Local Storage
```typescript
@UseInterceptors(PrismaUnitOfWorkInterceptor)
@Controller()
export class AppController {
  constructor(@Inject(ALS_SERVICE) private readonly _alsService: AlsService) {}

  @Post('/users')
  public async createUser(
    @Body()
    data: {
      email: string;
      name: string;
      posts: Array<{ title: string; content: string; published: boolean }>;
    }
  ) {
    const prismaClient = this._alsService.getClient<PrismaService>();
    const { posts, ...props } = data;

    const user = await prismaClient.user.create({ data: props });
    const createdPosts = await Promise.all(
      posts.map((post) =>
        prismaClient.post.create({ data: { ...post, authorId: user.id } })
      )
    );

    return { ...user, posts: createdPosts };
  }
}
```
