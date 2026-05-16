import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { MembersModule } from './members/members.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { TemplatesModule } from './templates/templates.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }: { req: Request }) => ({ req }),
    }),
    PrismaModule,
    MembersModule,
    PostsModule,
    AuthModule,
    ContactModule,
    TemplatesModule,
  ],
})
export class AppModule {}
