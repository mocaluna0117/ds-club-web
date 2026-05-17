import { AuthService } from './auth.service';
import { LoginInput } from './auth.input';
export declare class AuthResolver {
    private readonly authService;
    constructor(authService: AuthService);
    login(input: LoginInput): Promise<{
        accessToken: string;
        adminName: string;
    }>;
}
