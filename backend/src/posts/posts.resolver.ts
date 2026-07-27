import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PostType } from '@prisma/client';
import { PostsService } from './posts.service';
import { Post } from './post.model';
import { CreatePostInput, UpdatePostInput } from './post.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RebuildService } from '../rebuild/rebuild.service';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly rebuildService: RebuildService,
  ) {}

  @Query(() => [Post], { name: 'posts' })
  findBlogs() {
    return this.postsService.findAll(true, PostType.BLOG);
  }

  @Query(() => [Post], { name: 'activities' })
  findActivities() {
    return this.postsService.findAll(true, PostType.ACTIVITY);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Post], { name: 'allPosts' })
  findAllAdmin() {
    return this.postsService.findAll(false);
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  async createPost(@Args('input') input: CreatePostInput, @Context() ctx: any) {
    const post = await this.postsService.create(input, ctx.req.user.id);
    this.rebuildService.trigger();
    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  async updatePost(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdatePostInput,
  ) {
    const post = await this.postsService.update(id, input);
    this.rebuildService.trigger();
    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  async removePost(@Args('id', { type: () => Int }) id: number) {
    const post = await this.postsService.remove(id);
    this.rebuildService.trigger();
    return post;
  }
}
