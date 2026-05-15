import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsBoolean, IsOptional, IsInt } from 'class-validator';

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
}
