import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { notifyUnauthenticated } from './authToken';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL ?? 'http://localhost:3001/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('ds_club_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

/**
 * JWT の期限切れ (既定7日) を検知してログイン状態を捨てる。
 * これが無いと、期限切れ後も画面上は「記事0件・メンバー0件」に見えてしまい、
 * 障害なのかログインが切れたのかを運営者本人が切り分けられない。
 */
const authErrorLink = onError(({ graphQLErrors, networkError }) => {
  // ログインしていない訪問者の 401 には反応しない
  if (!localStorage.getItem('ds_club_token')) return;

  const unauthorized =
    graphQLErrors?.some((e) => {
      if (e.extensions?.code === 'UNAUTHENTICATED') return true;
      const original = e.extensions?.originalError as { statusCode?: number } | undefined;
      return original?.statusCode === 401;
    }) ?? false;
  const networkUnauthorized = (networkError as { statusCode?: number } | null)?.statusCode === 401;

  if (unauthorized || networkUnauthorized) notifyUnauthenticated();
});

export const apolloClient = new ApolloClient({
  link: from([authErrorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
