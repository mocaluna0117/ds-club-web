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
exports.PostsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const posts_service_1 = require("./posts.service");
const post_model_1 = require("./post.model");
const post_input_1 = require("./post.input");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const optional_jwt_auth_guard_1 = require("../auth/optional-jwt-auth.guard");
const rebuild_service_1 = require("../rebuild/rebuild.service");
let PostsResolver = class PostsResolver {
    postsService;
    rebuildService;
    constructor(postsService, rebuildService) {
        this.postsService = postsService;
        this.rebuildService = rebuildService;
    }
    findBlogs() {
        return this.postsService.findAll(true, client_1.PostType.BLOG);
    }
    findActivities() {
        return this.postsService.findAll(true, client_1.PostType.ACTIVITY);
    }
    findAllAdmin() {
        return this.postsService.findAll(false);
    }
    findOne(id, ctx) {
        return this.postsService.findOne(id, !!ctx.req.user);
    }
    async createPost(input, ctx) {
        const post = await this.postsService.create(input, ctx.req.user.id);
        this.rebuildService.trigger();
        return post;
    }
    async updatePost(id, input) {
        const post = await this.postsService.update(id, input);
        this.rebuildService.trigger();
        return post;
    }
    async removePost(id) {
        const post = await this.postsService.remove(id);
        this.rebuildService.trigger();
        return post;
    }
};
exports.PostsResolver = PostsResolver;
__decorate([
    (0, graphql_1.Query)(() => [post_model_1.Post], { name: 'posts' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PostsResolver.prototype, "findBlogs", null);
__decorate([
    (0, graphql_1.Query)(() => [post_model_1.Post], { name: 'activities' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PostsResolver.prototype, "findActivities", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Query)(() => [post_model_1.Post], { name: 'allPosts' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PostsResolver.prototype, "findAllAdmin", null);
__decorate([
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, graphql_1.Query)(() => post_model_1.Post, { name: 'post' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PostsResolver.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => post_model_1.Post),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [post_input_1.CreatePostInput, Object]),
    __metadata("design:returntype", Promise)
], PostsResolver.prototype, "createPost", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => post_model_1.Post),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, post_input_1.UpdatePostInput]),
    __metadata("design:returntype", Promise)
], PostsResolver.prototype, "updatePost", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => post_model_1.Post),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostsResolver.prototype, "removePost", null);
exports.PostsResolver = PostsResolver = __decorate([
    (0, graphql_1.Resolver)(() => post_model_1.Post),
    __metadata("design:paramtypes", [posts_service_1.PostsService,
        rebuild_service_1.RebuildService])
], PostsResolver);
//# sourceMappingURL=posts.resolver.js.map