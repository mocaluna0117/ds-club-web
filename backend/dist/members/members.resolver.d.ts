import { MembersService } from './members.service';
import { CreateMemberInput, UpdateMemberInput } from './member.input';
import { RebuildService } from '../rebuild/rebuild.service';
export declare class MembersResolver {
    private readonly membersService;
    private readonly rebuildService;
    constructor(membersService: MembersService, rebuildService: RebuildService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        role: string;
        grade: number;
        bio: string | null;
        imageUrl: string | null;
        github: string | null;
        twitter: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__MemberClient<{
        name: string;
        role: string;
        grade: number;
        bio: string | null;
        imageUrl: string | null;
        github: string | null;
        twitter: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    createMember(input: CreateMemberInput): Promise<{
        name: string;
        role: string;
        grade: number;
        bio: string | null;
        imageUrl: string | null;
        github: string | null;
        twitter: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMember(id: number, input: UpdateMemberInput): Promise<{
        name: string;
        role: string;
        grade: number;
        bio: string | null;
        imageUrl: string | null;
        github: string | null;
        twitter: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeMember(id: number): Promise<{
        name: string;
        role: string;
        grade: number;
        bio: string | null;
        imageUrl: string | null;
        github: string | null;
        twitter: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
