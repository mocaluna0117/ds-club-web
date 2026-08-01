import { ExecutionContext } from '@nestjs/common';
declare const OptionalJwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class OptionalJwtAuthGuard extends OptionalJwtAuthGuard_base {
    getRequest(context: ExecutionContext): any;
    handleRequest<TUser>(_err: unknown, user: TUser): TUser | null;
}
export {};
