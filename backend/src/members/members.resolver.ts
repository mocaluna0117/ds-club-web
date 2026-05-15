import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MembersService } from './members.service';
import { Member } from './member.model';
import { CreateMemberInput, UpdateMemberInput } from './member.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Member)
export class MembersResolver {
  constructor(private readonly membersService: MembersService) {}

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
  createMember(@Args('input') input: CreateMemberInput) {
    return this.membersService.create(input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Member)
  updateMember(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateMemberInput,
  ) {
    return this.membersService.update(id, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Member)
  removeMember(@Args('id', { type: () => Int }) id: number) {
    return this.membersService.remove(id);
  }
}
