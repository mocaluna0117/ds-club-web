import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PostType } from '../posts/post.model';

@ObjectType()
export class Template {
  @Field(() => Int) id: number;
  @Field() name: string;
  @Field(() => PostType) type: PostType;
  @Field() titleTemplate: string;
  @Field() content: string;
  @Field() createdAt: Date;
}
