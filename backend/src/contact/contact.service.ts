import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactInput } from './contact.input';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateContactInput) {
    return this.prisma.contact.create({ data: input });
  }

  findAll() {
    return this.prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
  }

  markRead(id: number) {
    return this.prisma.contact.update({ where: { id }, data: { read: true } });
  }
}
