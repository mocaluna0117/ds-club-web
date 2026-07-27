"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const members_service_1 = require("./members.service");
const member_model_1 = require("./member.model");
const member_input_1 = require("./member.input");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const rebuild_service_1 = require("../rebuild/rebuild.service");
let MembersResolver = class MembersResolver {
    membersService;
    rebuildService;
    constructor(membersService, rebuildService) {
        this.membersService = membersService;
        this.rebuildService = rebuildService;
    }
    findAll() {
        return this.membersService.findAll();
    }
    findOne(id) {
        return this.membersService.findOne(id);
    }
    async createMember(input) {
        const member = await this.membersService.create(input);
        this.rebuildService.trigger();
        return member;
    }
    async updateMember(id, input) {
        const member = await this.membersService.update(id, input);
        this.rebuildService.trigger();
        return member;
    }
    async removeMember(id) {
        const member = await this.membersService.remove(id);
        this.rebuildService.trigger();
        return member;
    }
};
exports.MembersResolver = MembersResolver;
__decorate([
    (0, graphql_1.Query)(() => [member_model_1.Member], { name: 'members' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MembersResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => member_model_1.Member, { name: 'member' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MembersResolver.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => member_model_1.Member),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [member_input_1.CreateMemberInput]),
    __metadata("design:returntype", Promise)
], MembersResolver.prototype, "createMember", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => member_model_1.Member),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, member_input_1.UpdateMemberInput]),
    __metadata("design:returntype", Promise)
], MembersResolver.prototype, "updateMember", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => member_model_1.Member),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MembersResolver.prototype, "removeMember", null);
exports.MembersResolver = MembersResolver = __decorate([
    (0, graphql_1.Resolver)(() => member_model_1.Member),
    __metadata("design:paramtypes", [members_service_1.MembersService,
        rebuild_service_1.RebuildService])
], MembersResolver);
//# sourceMappingURL=members.resolver.js.map