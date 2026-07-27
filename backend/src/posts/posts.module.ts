import { Module } from '@nestjs/common';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';
import { RebuildModule } from '../rebuild/rebuild.module';

@Module({
  imports: [RebuildModule],
  providers: [PostsResolver, PostsService],
})
export class PostsModule {}
