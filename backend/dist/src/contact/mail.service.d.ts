import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private config;
    private readonly logger;
    constructor(config: ConfigService);
    sendReply(to: string, replyBody: string): Promise<void>;
}
