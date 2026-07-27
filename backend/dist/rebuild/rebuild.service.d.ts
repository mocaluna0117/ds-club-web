import { OnApplicationShutdown } from '@nestjs/common';
export declare class RebuildService implements OnApplicationShutdown {
    private readonly logger;
    private timer?;
    private pending;
    private static readonly DEBOUNCE_MS;
    trigger(): void;
    onApplicationShutdown(): Promise<void>;
    private dispatch;
}
