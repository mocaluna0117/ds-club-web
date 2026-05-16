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
      coverImage
      createdAt
      updatedAt
      author {
        name
      }
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
