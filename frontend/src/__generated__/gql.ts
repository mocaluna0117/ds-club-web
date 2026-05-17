/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetMembers {\n    members {\n      id\n      name\n      role\n      grade\n      bio\n      imageUrl\n      github\n      twitter\n    }\n  }\n": typeof types.GetMembersDocument,
    "\n  query GetPosts {\n    posts {\n      id\n      title\n      excerpt\n      coverImage\n      createdAt\n      author {\n        name\n      }\n    }\n  }\n": typeof types.GetPostsDocument,
    "\n  query GetActivities {\n    activities {\n      id\n      title\n      excerpt\n      coverImage\n      createdAt\n      author {\n        name\n      }\n    }\n  }\n": typeof types.GetActivitiesDocument,
    "\n  query GetPost($id: Int!) {\n    post(id: $id) {\n      id\n      title\n      content\n      type\n      coverImage\n      createdAt\n      updatedAt\n      author {\n        name\n      }\n    }\n  }\n": typeof types.GetPostDocument,
    "\n  mutation RemovePost($id: Int!) {\n    removePost(id: $id) {\n      id\n    }\n  }\n": typeof types.RemovePostDocument,
    "\n  mutation RemoveMember($id: Int!) {\n    removeMember(id: $id) {\n      id\n    }\n  }\n": typeof types.RemoveMemberDocument,
    "\n  mutation CreatePost($input: CreatePostInput!) {\n    createPost(input: $input) {\n      id\n    }\n  }\n": typeof types.CreatePostDocument,
    "\n  mutation UpdateMember($id: Int!, $input: UpdateMemberInput!) {\n    updateMember(id: $id, input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateMemberDocument,
    "\n  mutation CreateMember($input: CreateMemberInput!) {\n    createMember(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateMemberDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      adminName\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation SendContact($input: CreateContactInput!) {\n    sendContact(input: $input) {\n      id\n    }\n  }\n": typeof types.SendContactDocument,
    "\n  query GetAllPostsAdmin {\n    allPosts {\n      id\n      title\n      type\n      published\n      createdAt\n      author {\n        name\n      }\n    }\n  }\n": typeof types.GetAllPostsAdminDocument,
    "\n  mutation UpdatePost($id: Int!, $input: UpdatePostInput!) {\n    updatePost(id: $id, input: $input) {\n      id\n      published\n    }\n  }\n": typeof types.UpdatePostDocument,
    "\n  query GetContacts {\n    contacts {\n      id\n      name\n      email\n      message\n      read\n      createdAt\n    }\n  }\n": typeof types.GetContactsDocument,
    "\n  mutation MarkContactRead($id: Int!) {\n    markContactRead(id: $id) {\n      id\n      read\n    }\n  }\n": typeof types.MarkContactReadDocument,
    "\n  mutation ReplyToContact($id: Int!, $body: String!) {\n    replyToContact(id: $id, body: $body) {\n      id\n      read\n    }\n  }\n": typeof types.ReplyToContactDocument,
    "\n  query GetTemplates($type: PostType) {\n    templates(type: $type) {\n      id\n      name\n      type\n      titleTemplate\n      content\n      createdAt\n    }\n  }\n": typeof types.GetTemplatesDocument,
    "\n  mutation CreateTemplate($input: CreateTemplateInput!) {\n    createTemplate(input: $input) {\n      id\n      name\n      type\n      titleTemplate\n      content\n      createdAt\n    }\n  }\n": typeof types.CreateTemplateDocument,
    "\n  mutation RemoveTemplate($id: Int!) {\n    removeTemplate(id: $id) {\n      id\n    }\n  }\n": typeof types.RemoveTemplateDocument,
};
const documents: Documents = {
    "\n  query GetMembers {\n    members {\n      id\n      name\n      role\n      grade\n      bio\n      imageUrl\n      github\n      twitter\n    }\n  }\n": types.GetMembersDocument,
    "\n  query GetPosts {\n    posts {\n      id\n      title\n      excerpt\n      coverImage\n      createdAt\n      author {\n        name\n      }\n    }\n  }\n": types.GetPostsDocument,
    "\n  query GetActivities {\n    activities {\n      id\n      title\n      excerpt\n      coverImage\n      createdAt\n      author {\n        name\n      }\n    }\n  }\n": types.GetActivitiesDocument,
    "\n  query GetPost($id: Int!) {\n    post(id: $id) {\n      id\n      title\n      content\n      type\n      coverImage\n      createdAt\n      updatedAt\n      author {\n        name\n      }\n    }\n  }\n": types.GetPostDocument,
    "\n  mutation RemovePost($id: Int!) {\n    removePost(id: $id) {\n      id\n    }\n  }\n": types.RemovePostDocument,
    "\n  mutation RemoveMember($id: Int!) {\n    removeMember(id: $id) {\n      id\n    }\n  }\n": types.RemoveMemberDocument,
    "\n  mutation CreatePost($input: CreatePostInput!) {\n    createPost(input: $input) {\n      id\n    }\n  }\n": types.CreatePostDocument,
    "\n  mutation UpdateMember($id: Int!, $input: UpdateMemberInput!) {\n    updateMember(id: $id, input: $input) {\n      id\n    }\n  }\n": types.UpdateMemberDocument,
    "\n  mutation CreateMember($input: CreateMemberInput!) {\n    createMember(input: $input) {\n      id\n    }\n  }\n": types.CreateMemberDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      adminName\n    }\n  }\n": types.LoginDocument,
    "\n  mutation SendContact($input: CreateContactInput!) {\n    sendContact(input: $input) {\n      id\n    }\n  }\n": types.SendContactDocument,
    "\n  query GetAllPostsAdmin {\n    allPosts {\n      id\n      title\n      type\n      published\n      createdAt\n      author {\n        name\n      }\n    }\n  }\n": types.GetAllPostsAdminDocument,
    "\n  mutation UpdatePost($id: Int!, $input: UpdatePostInput!) {\n    updatePost(id: $id, input: $input) {\n      id\n      published\n    }\n  }\n": types.UpdatePostDocument,
    "\n  query GetContacts {\n    contacts {\n      id\n      name\n      email\n      message\n      read\n      createdAt\n    }\n  }\n": types.GetContactsDocument,
    "\n  mutation MarkContactRead($id: Int!) {\n    markContactRead(id: $id) {\n      id\n      read\n    }\n  }\n": types.MarkContactReadDocument,
    "\n  mutation ReplyToContact($id: Int!, $body: String!) {\n    replyToContact(id: $id, body: $body) {\n      id\n      read\n    }\n  }\n": types.ReplyToContactDocument,
    "\n  query GetTemplates($type: PostType) {\n    templates(type: $type) {\n      id\n      name\n      type\n      titleTemplate\n      content\n      createdAt\n    }\n  }\n": types.GetTemplatesDocument,
    "\n  mutation CreateTemplate($input: CreateTemplateInput!) {\n    createTemplate(input: $input) {\n      id\n      name\n      type\n      titleTemplate\n      content\n      createdAt\n    }\n  }\n": types.CreateTemplateDocument,
    "\n  mutation RemoveTemplate($id: Int!) {\n    removeTemplate(id: $id) {\n      id\n    }\n  }\n": types.RemoveTemplateDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMembers {\n    members {\n      id\n      name\n      role\n      grade\n      bio\n      imageUrl\n      github\n      twitter\n    }\n  }\n"): (typeof documents)["\n  query GetMembers {\n    members {\n      id\n      name\n      role\n      grade\n      bio\n      imageUrl\n      github\n      twitter\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPosts {\n    posts {\n      id\n      title\n      excerpt\n      coverImage\n      createdAt\n      author {\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPosts {\n    posts {\n      id\n      title\n      excerpt\n      coverImage\n      createdAt\n      author {\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetActivities {\n    activities {\n      id\n      title\n      excerpt\n      coverImage\n      createdAt\n      author {\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetActivities {\n    activities {\n      id\n      title\n      excerpt\n      coverImage\n      createdAt\n      author {\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPost($id: Int!) {\n    post(id: $id) {\n      id\n      title\n      content\n      type\n      coverImage\n      createdAt\n      updatedAt\n      author {\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPost($id: Int!) {\n    post(id: $id) {\n      id\n      title\n      content\n      type\n      coverImage\n      createdAt\n      updatedAt\n      author {\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemovePost($id: Int!) {\n    removePost(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation RemovePost($id: Int!) {\n    removePost(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveMember($id: Int!) {\n    removeMember(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveMember($id: Int!) {\n    removeMember(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePost($input: CreatePostInput!) {\n    createPost(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePost($input: CreatePostInput!) {\n    createPost(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateMember($id: Int!, $input: UpdateMemberInput!) {\n    updateMember(id: $id, input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateMember($id: Int!, $input: UpdateMemberInput!) {\n    updateMember(id: $id, input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateMember($input: CreateMemberInput!) {\n    createMember(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateMember($input: CreateMemberInput!) {\n    createMember(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      adminName\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      adminName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SendContact($input: CreateContactInput!) {\n    sendContact(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation SendContact($input: CreateContactInput!) {\n    sendContact(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllPostsAdmin {\n    allPosts {\n      id\n      title\n      type\n      published\n      createdAt\n      author {\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllPostsAdmin {\n    allPosts {\n      id\n      title\n      type\n      published\n      createdAt\n      author {\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdatePost($id: Int!, $input: UpdatePostInput!) {\n    updatePost(id: $id, input: $input) {\n      id\n      published\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePost($id: Int!, $input: UpdatePostInput!) {\n    updatePost(id: $id, input: $input) {\n      id\n      published\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetContacts {\n    contacts {\n      id\n      name\n      email\n      message\n      read\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query GetContacts {\n    contacts {\n      id\n      name\n      email\n      message\n      read\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation MarkContactRead($id: Int!) {\n    markContactRead(id: $id) {\n      id\n      read\n    }\n  }\n"): (typeof documents)["\n  mutation MarkContactRead($id: Int!) {\n    markContactRead(id: $id) {\n      id\n      read\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReplyToContact($id: Int!, $body: String!) {\n    replyToContact(id: $id, body: $body) {\n      id\n      read\n    }\n  }\n"): (typeof documents)["\n  mutation ReplyToContact($id: Int!, $body: String!) {\n    replyToContact(id: $id, body: $body) {\n      id\n      read\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetTemplates($type: PostType) {\n    templates(type: $type) {\n      id\n      name\n      type\n      titleTemplate\n      content\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query GetTemplates($type: PostType) {\n    templates(type: $type) {\n      id\n      name\n      type\n      titleTemplate\n      content\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateTemplate($input: CreateTemplateInput!) {\n    createTemplate(input: $input) {\n      id\n      name\n      type\n      titleTemplate\n      content\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTemplate($input: CreateTemplateInput!) {\n    createTemplate(input: $input) {\n      id\n      name\n      type\n      titleTemplate\n      content\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveTemplate($id: Int!) {\n    removeTemplate(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveTemplate($id: Int!) {\n    removeTemplate(id: $id) {\n      id\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;