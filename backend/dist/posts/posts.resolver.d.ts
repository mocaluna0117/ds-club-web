import { PostsService } from './posts.service';
import { CreatePostInput, UpdatePostInput } from './post.input';
import { RebuildService } from '../rebuild/rebuild.service';
export declare class PostsResolver {
    private readonly postsService;
    private readonly rebuildService;
    constructor(postsService: PostsService, rebuildService: RebuildService);
    findBlogs(): import(".prisma/client").Prisma.PrismaPromise<({
        author: {
            name: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.PostType;
        title: string;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        published: boolean;
        authorId: number;
    })[]>;
    findActivities(): import(".prisma/client").Prisma.PrismaPromise<({
        author: {
            name: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.PostType;
        title: string;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        published: boolean;
        authorId: number;
    })[]>;
    findAllAdmin(): import(".prisma/client").Prisma.PrismaPromise<({
        author: {
            name: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.PostType;
        title: string;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        published: boolean;
        authorId: number;
    })[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__PostClient<{
        author: {
            name: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.PostType;
        title: string;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        published: boolean;
        authorId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    createPost(input: CreatePostInput, ctx: any): Promise<{
        author: {
            name: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.PostType;
        title: string;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        published: boolean;
        authorId: number;
    }>;
    updatePost(id: number, input: UpdatePostInput): Promise<{
        author: {
            name: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.PostType;
        title: string;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        published: boolean;
        authorId: number;
    }>;
    removePost(id: number): Promise<{
        author: {
            name: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.PostType;
        title: string;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        published: boolean;
        authorId: number;
    }>;
}
