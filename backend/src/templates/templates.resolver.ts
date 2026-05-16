import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { Template } from './template.model';
import { CreateTemplateInput } from './dto/create-template.input';
import { PostType } from '../posts/post.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Template)
export class TemplatesResolver {
  constructor(private readonly templatesService: TemplatesService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Template], { name: 'templates' })
  findAll(@Args('type', { type: () => PostType, nullable: true }) type?: PostType) {
    return this.templatesService.findAll(type);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Template)
  createTemplate(@Args('input') input: CreateTemplateInput) {
    return this.templatesService.create(input.name, input.type, input.titleTemplate, input.content);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Template)
  removeTemplate(@Args('id', { type: () => Int }) id: number) {
    return this.templatesService.remove(id);
  }
}
