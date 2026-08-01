import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { MembersModule } from './members/members.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TemplatesModule } from './templates/templates.module';

const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }: { req: Request }) => ({ req }),
      // 本番ではスキーマの探索と Sandbox を閉じる
      introspection: !isProduction,
      playground: !isProduction,
      // Prisma の例外はクエリ文や内部構造を含むため、本番ではそのまま返さない
      formatError: (formattedError) => {
        if (!isProduction) return formattedError;
        const message = formattedError.message ?? '';
        const leaksInternals =
          message.includes('prisma.') || message.includes('Invalid `') || message.length > 300;
        return leaksInternals
          ? { ...formattedError, message: 'リクエストを処理できませんでした' }
          : formattedError;
      },
    }),
    PrismaModule,
    MembersModule,
    PostsModule,
    AuthModule,
    TemplatesModule,
  ],
})
export class AppModule {}
