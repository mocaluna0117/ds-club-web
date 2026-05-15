import { gql } from '@apollo/client';

export const GET_MEMBERS = gql`
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
`;

export const GET_POSTS = gql`
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
`;

export const GET_POST = gql`
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
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      adminName
    }
  }
`;

export const SEND_CONTACT = gql`
  mutation SendContact($input: CreateContactInput!) {
    sendContact(input: $input) {
      id
    }
  }
`;
