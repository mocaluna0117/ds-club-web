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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.PostAuthor = exports.PostType = void 0;
const graphql_1 = require("@nestjs/graphql");
var PostType;
(function (PostType) {
    PostType["BLOG"] = "BLOG";
    PostType["ACTIVITY"] = "ACTIVITY";
})(PostType || (exports.PostType = PostType = {}));
(0, graphql_1.registerEnumType)(PostType, { name: 'PostType' });
let PostAuthor = class PostAuthor {
    id;
    name;
};
exports.PostAuthor = PostAuthor;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], PostAuthor.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PostAuthor.prototype, "name", void 0);
exports.PostAuthor = PostAuthor = __decorate([
    (0, graphql_1.ObjectType)()
], PostAuthor);
let Post = class Post {
    id;
    title;
    content;
    excerpt;
    coverImage;
    published;
    type;
    author;
    createdAt;
    updatedAt;
};
exports.Post = Post;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Post.prototype, "excerpt", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Post.prototype, "coverImage", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], Post.prototype, "published", void 0);
__decorate([
    (0, graphql_1.Field)(() => PostType),
    __metadata("design:type", String)
], Post.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(() => PostAuthor),
    __metadata("design:type", PostAuthor)
], Post.prototype, "author", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Post.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Post.prototype, "updatedAt", void 0);
exports.Post = Post = __decorate([
    (0, graphql_1.ObjectType)()
], Post);
//# sourceMappingURL=post.model.js.map