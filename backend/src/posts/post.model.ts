import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PostAuthor {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}

@ObjectType()
export class Post {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  excerpt?: string;

  @Field({ nullable: true })
  coverImage?: string;

  @Field()
  published: boolean;

  @Field(() => PostAuthor)
  author: PostAuthor;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
