"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RebuildService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RebuildService = void 0;
const common_1 = require("@nestjs/common");
let RebuildService = class RebuildService {
    static { RebuildService_1 = this; }
    logger = new common_1.Logger(RebuildService_1.name);
    timer;
    pending = false;
    static DEBOUNCE_MS = 10_000;
    trigger() {
        if (!process.env.GITHUB_REBUILD_TOKEN)
            return;
        clearTimeout(this.timer);
        this.pending = true;
        this.timer = setTimeout(() => void this.dispatch(), RebuildService_1.DEBOUNCE_MS);
    }
    async onApplicationShutdown() {
        if (!this.pending)
            return;
        clearTimeout(this.timer);
        await this.dispatch();
    }
    async dispatch() {
        this.pending = false;
        const repo = process.env.GITHUB_REBUILD_REPO ?? 'mocaluna0117/ds-club-web';
        try {
            const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_REBUILD_TOKEN}`,
                    Accept: 'application/vnd.github+json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'ds-club-api',
                },
                body: JSON.stringify({ event_type: 'content-updated' }),
            });
            if (res.ok) {
                this.logger.log('repository_dispatch sent (content-updated)');
            }
            else {
                this.logger.warn(`repository_dispatch failed: HTTP ${res.status}`);
            }
        }
        catch (e) {
            this.logger.warn(`repository_dispatch failed: ${e.message}`);
        }
    }
};
exports.RebuildService = RebuildService;
exports.RebuildService = RebuildService = RebuildService_1 = __decorate([
    (0, common_1.Injectable)()
], RebuildService);
//# sourceMappingURL=rebuild.service.js.map