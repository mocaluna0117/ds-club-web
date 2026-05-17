import { TemplatesService } from './templates.service';
import { CreateTemplateInput } from './dto/create-template.input';
import { PostType } from '../posts/post.model';
export declare class TemplatesResolver {
    private readonly templatesService;
    constructor(templatesService: TemplatesService);
    findAll(type?: PostType): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.PostType;
        content: string;
        titleTemplate: string;
    }[]>;
    createTemplate(input: CreateTemplateInput): import("@prisma/client").Prisma.Prisma__TemplateClient<{
        id: number;
        name: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.PostType;
        content: string;
        titleTemplate: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    removeTemplate(id: number): import("@prisma/client").Prisma.Prisma__TemplateClient<{
        id: number;
        name: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.PostType;
        content: string;
        titleTemplate: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
