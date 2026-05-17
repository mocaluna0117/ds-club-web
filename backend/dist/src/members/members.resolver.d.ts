import { MembersService } from './members.service';
import { CreateMemberInput, UpdateMemberInput } from './member.input';
export declare class MembersResolver {
    private readonly membersService;
    constructor(membersService: MembersService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        grade: number;
        bio: string | null;
        imageUrl: string | null;
        github: string | null;
        twitter: string | null;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__MemberClient<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        grade: number;
        bio: string | null;
        imageUrl: string | null;
        github: string | null;
        twitter: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    createMember(input: CreateMemberInput): import("@prisma/client").Prisma.Prisma__MemberClient<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        grade: number;
        bio: string | null;
        imageUrl: string | null;
        github: string | null;
        twitter: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateMember(id: number, input: UpdateMemberInput): import("@prisma/client").Prisma.Prisma__MemberClient<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        grade: number;
        bio: string | null;
        imageUrl: string | null;
        github: string | null;
        twitter: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    removeMember(id: number): import("@prisma/client").Prisma.Prisma__MemberClient<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        grade: number;
        bio: string | null;
        imageUrl: string | null;
        github: string | null;
        twitter: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
