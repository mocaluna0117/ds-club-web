import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostInput, UpdatePostInput } from './post.input';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(publishedOnly = true) {
    return this.prisma.post.findMany({
      where: publishedOnly ? { published: true } : undefined,
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUniqueOrThrow({
      where: { id },
      include: { author: { select: { id: true, name: true } } },
    });
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
