import { ContactService } from './contact.service';
import { CreateContactInput } from './contact.input';
export declare class ContactResolver {
    private readonly contactService;
    constructor(contactService: ContactService);
    sendContact(input: CreateContactInput): import("@prisma/client").Prisma.Prisma__ContactClient<{
        name: string;
        email: string;
        message: string;
        read: boolean;
        createdAt: Date;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        email: string;
        message: string;
        read: boolean;
        createdAt: Date;
        id: number;
    }[]>;
    markContactRead(id: number): import("@prisma/client").Prisma.Prisma__ContactClient<{
        name: string;
        email: string;
        message: string;
        read: boolean;
        createdAt: Date;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
