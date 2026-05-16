import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostType } from '../posts/post.model';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  findAll(type?: PostType) {
    return this.prisma.template.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  create(name: string, type: PostType, titleTemplate: string, content: string) {
    return this.prisma.template.create({ data: { name, type, titleTemplate, content } });
  }

  remove(id: number) {
    return this.prisma.template.delete({ where: { id } });
  }
}
