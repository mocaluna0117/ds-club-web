import { PostType } from '../posts/post.model';
export declare class Template {
    id: number;
    name: string;
    type: PostType;
    titleTemplate: string;
    content: string;
    createdAt: Date;
}
