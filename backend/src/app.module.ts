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

// RENDER は Render が全サービスに必ず入れる変数。render.yaml の Blueprint が
// 適用されていない場合でも本番と判定できるよう、NODE_ENV と併用する
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

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
