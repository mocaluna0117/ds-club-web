import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsInt, IsOptional, IsUrl, Min, Max } from 'class-validator';

@InputType()
export class CreateMemberInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  role: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(6)
  grade: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  github?: string;

  @Field({ nullable: true })
  @IsOptional()
  twitter?: string;
}

@InputType()
export class UpdateMemberInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  role?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  grade?: number;

  @Field({ nullable: true })
  @IsOptional()
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  github?: string;

  @Field({ nullable: true })
  @IsOptional()
  twitter?: string;
}
