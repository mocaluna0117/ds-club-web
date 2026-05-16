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
