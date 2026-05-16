import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { PostType } from './post.model';

@InputType()
export class CreatePostInput {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  content: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @Field({ nullable: true })
  @IsOptional()
  coverImage?: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  published: boolean;

  @Field(() => PostType, { defaultValue: PostType.BLOG })
  @IsEnum(PostType)
  type: PostType;
}

@InputType()
export class UpdatePostInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  content?: string;

  @Field({ nullable: true })
  @IsOptional()
  excerpt?: string;

  @Field({ nullable: true })
  @IsOptional()
  coverImage?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @Field(() => PostType, { nullable: true })
  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;
}
