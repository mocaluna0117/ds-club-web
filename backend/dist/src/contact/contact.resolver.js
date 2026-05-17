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
exports.ContactResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const contact_service_1 = require("./contact.service");
const contact_model_1 = require("./contact.model");
const contact_input_1 = require("./contact.input");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ContactResolver = class ContactResolver {
    contactService;
    constructor(contactService) {
        this.contactService = contactService;
    }
    sendContact(input) {
        return this.contactService.create(input);
    }
    findAll() {
        return this.contactService.findAll();
    }
    markContactRead(id) {
        return this.contactService.markRead(id);
    }
};
exports.ContactResolver = ContactResolver;
__decorate([
    (0, graphql_1.Mutation)(() => contact_model_1.Contact),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contact_input_1.CreateContactInput]),
    __metadata("design:returntype", void 0)
], ContactResolver.prototype, "sendContact", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Query)(() => [contact_model_1.Contact], { name: 'contacts' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContactResolver.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => contact_model_1.Contact),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ContactResolver.prototype, "markContactRead", null);
exports.ContactResolver = ContactResolver = __decorate([
    (0, graphql_1.Resolver)(() => contact_model_1.Contact),
    __metadata("design:paramtypes", [contact_service_1.ContactService])
], ContactResolver);
//# sourceMappingURL=contact.resolver.js.map