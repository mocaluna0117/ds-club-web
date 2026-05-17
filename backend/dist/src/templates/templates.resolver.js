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
exports.TemplatesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const templates_service_1 = require("./templates.service");
const template_model_1 = require("./template.model");
const create_template_input_1 = require("./dto/create-template.input");
const post_model_1 = require("../posts/post.model");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let TemplatesResolver = class TemplatesResolver {
    templatesService;
    constructor(templatesService) {
        this.templatesService = templatesService;
    }
    findAll(type) {
        return this.templatesService.findAll(type);
    }
    createTemplate(input) {
        return this.templatesService.create(input.name, input.type, input.titleTemplate, input.content);
    }
    removeTemplate(id) {
        return this.templatesService.remove(id);
    }
};
exports.TemplatesResolver = TemplatesResolver;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Query)(() => [template_model_1.Template], { name: 'templates' }),
    __param(0, (0, graphql_1.Args)('type', { type: () => post_model_1.PostType, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TemplatesResolver.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => template_model_1.Template),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_template_input_1.CreateTemplateInput]),
    __metadata("design:returntype", void 0)
], TemplatesResolver.prototype, "createTemplate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => template_model_1.Template),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TemplatesResolver.prototype, "removeTemplate", null);
exports.TemplatesResolver = TemplatesResolver = __decorate([
    (0, graphql_1.Resolver)(() => template_model_1.Template),
    __metadata("design:paramtypes", [templates_service_1.TemplatesService])
], TemplatesResolver);
//# sourceMappingURL=templates.resolver.js.map