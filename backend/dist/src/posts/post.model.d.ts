export declare enum PostType {
    BLOG = "BLOG",
    ACTIVITY = "ACTIVITY"
}
export declare class PostAuthor {
    id: number;
    name: string;
}
export declare class Post {
    id: number;
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    published: boolean;
    type: PostType;
    author: PostAuthor;
    createdAt: Date;
    updatedAt: Date;
}
