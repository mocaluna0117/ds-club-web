import { graphql } from '../__generated__/gql';

export const GET_MEMBERS = graphql(`
  query GetMembers {
    members {
      id
      name
      role
      grade
      bio
      imageUrl
      github
      twitter
    }
  }
`);

export const GET_POSTS = graphql(`
  query GetPosts {
    posts {
      id
      title
      excerpt
      coverImage
      createdAt
      author {
        name
      }
    }
  }
`);

export const GET_ACTIVITIES = graphql(`
  query GetActivities {
    activities {
      id
      title
      excerpt
      coverImage
      createdAt
      author {
        name
      }
    }
  }
`);

export const GET_POST = graphql(`
  query GetPost($id: Int!) {
    post(id: $id) {
      id
      title
      content
      type
      coverImage
      createdAt
      updatedAt
      author {
        name
      }
    }
  }
`);

export const REMOVE_POST = graphql(`
  mutation RemovePost($id: Int!) {
    removePost(id: $id) {
      id
    }
  }
`);

export const REMOVE_MEMBER = graphql(`
  mutation RemoveMember($id: Int!) {
    removeMember(id: $id) {
      id
    }
  }
`);

export const CREATE_POST = graphql(`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
    }
  }
`);

export const UPDATE_MEMBER = graphql(`
  mutation UpdateMember($id: Int!, $input: UpdateMemberInput!) {
    updateMember(id: $id, input: $input) {
      id
    }
  }
`);

export const CREATE_MEMBER = graphql(`
  mutation CreateMember($input: CreateMemberInput!) {
    createMember(input: $input) {
      id
    }
  }
`);

export const LOGIN = graphql(`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      adminName
    }
  }
`);

export const SEND_CONTACT = graphql(`
  mutation SendContact($input: CreateContactInput!) {
    sendContact(input: $input) {
      id
    }
  }
`);

export const GET_TEMPLATES = graphql(`
  query GetTemplates($type: PostType) {
    templates(type: $type) {
      id
      name
      type
      titleTemplate
      content
      createdAt
    }
  }
`);

export const CREATE_TEMPLATE = graphql(`
  mutation CreateTemplate($input: CreateTemplateInput!) {
    createTemplate(input: $input) {
      id
      name
      type
      titleTemplate
      content
      createdAt
    }
  }
`);

export const REMOVE_TEMPLATE = graphql(`
  mutation RemoveTemplate($id: Int!) {
    removeTemplate(id: $id) {
      id
    }
  }
`);
