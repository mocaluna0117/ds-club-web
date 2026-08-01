import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * ログインしていれば req.user を埋め、していなくても素通りさせるガード。
 *
 * 記事詳細のように「未ログインでも見られるが、管理者だけは下書きも見られる」
 * クエリで使う。JwtAuthGuard と違い、トークンが無い/不正でも例外を投げない。
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    return GqlExecutionContext.create(context).getContext().req;
  }

  handleRequest<TUser>(_err: unknown, user: TUser): TUser | null {
    return user || null;
  }
}
