import { PostType } from './post.model';
export declare class CreatePostInput {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    published: boolean;
    type: PostType;
}
export declare class UpdatePostInput {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    published?: boolean;
    type?: PostType;
}
