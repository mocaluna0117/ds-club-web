import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Member {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  role: string;

  @Field(() => Int)
  grade: number;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  github?: string;

  @Field({ nullable: true })
  twitter?: string;

  @Field()
  createdAt: Date;
}
