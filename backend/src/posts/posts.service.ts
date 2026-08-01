import { Injectable, NotFoundException } from '@nestjs/common';
import { PostType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostInput, UpdatePostInput } from './post.input';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(publishedOnly = true, type?: PostType) {
    return this.prisma.post.findMany({
      where: {
        ...(publishedOnly ? { published: true } : {}),
        ...(type ? { type } : {}),
      },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * @param includeUnpublished 管理者のみ true。未ログインには下書きを返さない
   */
  async findOne(id: number, includeUnpublished = false) {
    const post = await this.prisma.post.findFirst({
      where: { id, ...(includeUnpublished ? {} : { published: true }) },
      include: { author: { select: { id: true, name: true } } },
    });
    if (!post) throw new NotFoundException('記事が見つかりませんでした');
    return post;
  }

  create(input: CreatePostInput, authorId: number) {
    return this.prisma.post.create({
      data: { ...input, authorId },
      include: { author: { select: { id: true, name: true } } },
    });
  }

  update(id: number, input: UpdatePostInput) {
    return this.prisma.post.update({
      where: { id },
      data: input,
      include: { author: { select: { id: true, name: true } } },
    });
  }

  remove(id: number) {
    return this.prisma.post.delete({
      where: { id },
      include: { author: { select: { id: true, name: true } } },
    });
  }
}
