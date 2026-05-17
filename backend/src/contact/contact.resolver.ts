import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Contact } from './contact.model';
import { CreateContactInput } from './contact.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Contact)
export class ContactResolver {
  constructor(private readonly contactService: ContactService) {}

  @Mutation(() => Contact)
  sendContact(@Args('input') input: CreateContactInput) {
    return this.contactService.create(input);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Contact], { name: 'contacts' })
  findAll() {
    return this.contactService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Contact)
  markContactRead(@Args('id', { type: () => Int }) id: number) {
    return this.contactService.markRead(id);
  }

}
