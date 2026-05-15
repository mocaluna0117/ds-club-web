import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberInput, UpdateMemberInput } from './member.input';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.member.findMany({ orderBy: { grade: 'asc' } });
  }

  findOne(id: number) {
    return this.prisma.member.findUniqueOrThrow({ where: { id } });
  }

  create(input: CreateMemberInput) {
    return this.prisma.member.create({ data: input });
  }

  update(id: number, input: UpdateMemberInput) {
    return this.prisma.member.update({ where: { id }, data: input });
  }

  remove(id: number) {
    return this.prisma.member.delete({ where: { id } });
  }
}
