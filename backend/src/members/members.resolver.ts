import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MembersService } from './members.service';
import { Member } from './member.model';
import { CreateMemberInput, UpdateMemberInput } from './member.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RebuildService } from '../rebuild/rebuild.service';

@Resolver(() => Member)
export class MembersResolver {
  constructor(
    private readonly membersService: MembersService,
    private readonly rebuildService: RebuildService,
  ) {}

  @Query(() => [Member], { name: 'members' })
  findAll() {
    return this.membersService.findAll();
  }

  @Query(() => Member, { name: 'member' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.membersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Member)
  async createMember(@Args('input') input: CreateMemberInput) {
    const member = await this.membersService.create(input);
    this.rebuildService.trigger();
    return member;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Member)
  async updateMember(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateMemberInput,
  ) {
    const member = await this.membersService.update(id, input);
    this.rebuildService.trigger();
    return member;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Member)
  async removeMember(@Args('id', { type: () => Int }) id: number) {
    const member = await this.membersService.remove(id);
    this.rebuildService.trigger();
    return member;
  }
}
