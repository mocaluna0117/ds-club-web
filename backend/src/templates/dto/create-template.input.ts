import { InputType, Field } from '@nestjs/graphql';
import { PostType } from '../../posts/post.model';

@InputType()
export class CreateTemplateInput {
  @Field() name: string;
  @Field(() => PostType) type: PostType;
  @Field() titleTemplate: string;
  @Field() content: string;
}
