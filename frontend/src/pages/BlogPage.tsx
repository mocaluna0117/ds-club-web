import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container, Heading, VStack, Box, Text, Image, Center,
  Flex, Button, HStack, Badge, Dialog,
} from '@chakra-ui/react';
import { GET_POSTS, GET_ALL_POSTS_ADMIN, REMOVE_POST } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/LoadingState';
import { PageTitle } from '../components/PageTitle';
import { publicFetchPolicy } from '../lib/publicFetchPolicy';

export function BlogPage() {
  const { token } = useAuth();
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);

  const { data: publicData, loading: publicLoading, error: publicError, refetch: refetchPublic } =
    useQuery(GET_POSTS, {
      // 未ログインはスナップショットが新しければAPIを叩かない(Renderを起こさない)
      fetchPolicy: publicFetchPolicy(),
      skip: !!token,
    });
  const { data: adminData, loading: adminLoading, error: adminError, refetch } =
    useQuery(GET_ALL_POSTS_ADMIN, {
      fetchPolicy: 'cache-and-network',
      skip: !token,
    });

  const [removePost, { loading: deleting }] = useMutation(REMOVE_POST, {
    onCompleted: () => { setDeleteTarget(null); void refetch(); },
  });

  const loading = token ? adminLoading : publicLoading;
  const data = token ? adminData : publicData;
  const posts = token
    ? (adminData?.allPosts ?? []).filter((p) => p.type === 'BLOG')
    : (publicData?.posts ?? []);

  const error = token ? adminError : publicError;
  const retry = token ? refetch : refetchPublic;

  if (loading && !data) return <LoadingState onRetry={() => void retry()} />;
  // エラーを空表示にすると、障害・ログイン失効・記事0件が区別できなくなる
  if (error && !data) {
    return (
      <Center py={20}>
        <Text color="gray.500">記事を読み込めませんでした。時間をおいて再度お試しください。</Text>
      </Center>
    );
  }

  return (
    <Container as="main" maxW="800px" py={12}>
      <PageTitle title="技術記事" />
      <Flex justify="space-between" align="center" mb={8}>
        <Heading as="h1" size="2xl" color="gray.800">技術記事</Heading>
        {token && (
          <Button asChild colorPalette="blue" size="sm">
            <RouterLink to="/admin/new-post">+ 記事を書く</RouterLink>
          </Button>
        )}
      </Flex>

      {posts.length === 0 && (
        <Center py={8}><Text color="gray.600">まだ記事がありません。</Text></Center>
      )}

      <VStack gap={6} align="stretch">
        {posts.map((post) => (
          <Box key={post.id} position="relative">
            <RouterLink to={`/blog/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box
                display="flex"
                flexDir="column"
                bg="white"
                border="1px solid"
                borderColor={'published' in post && !post.published ? 'gray.300' : 'gray.200'}
                borderRadius="xl"
                overflow="hidden"
                opacity={'published' in post && !post.published ? 0.75 : 1}
                _hover={{ boxShadow: 'md' }}
                transition="box-shadow 0.2s"
              >
                {post.coverImage && (
                  <Image src={post.coverImage} alt={post.title} h="200px" objectFit="cover" />
                )}
                <Box p={6}>
                  <Flex align="center" gap={2} mb={2}>
                    <Heading as="h2" size="lg" color="gray.800">{post.title}</Heading>
                    {'published' in post && !post.published && (
                      <Badge colorPalette="gray" size="sm" flexShrink={0}>下書き</Badge>
                    )}
                  </Flex>
                  {post.excerpt && <Text color="gray.500" lineHeight="tall" mb={4}>{post.excerpt}</Text>}
                  <Box display="flex" gap={4} color="gray.600" fontSize="sm">
                    <Text>{post.author.name}</Text>
                    <Text>{new Date(post.createdAt).toLocaleDateString('ja-JP')}</Text>
                  </Box>
                </Box>
              </Box>
            </RouterLink>
            {token && (
              <HStack position="absolute" top={3} right={3} gap={2}>
                <Button asChild size="xs" colorPalette="blue" variant="solid">
                  <RouterLink to={`/admin/edit-post/${post.id}`}>編集</RouterLink>
                </Button>
                <Button size="xs" colorPalette="red" variant="solid"
                  onClick={(e) => { e.preventDefault(); setDeleteTarget({ id: post.id, title: post.title }); }}>
                  削除
                </Button>
              </HStack>
            )}
          </Box>
        ))}
      </VStack>

      <Dialog.Root open={!!deleteTarget} onOpenChange={(e) => !e.open && setDeleteTarget(null)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header><Dialog.Title>記事を削除</Dialog.Title></Dialog.Header>
            <Dialog.Body>
              <Text>「{deleteTarget?.title}」を削除しますか？この操作は元に戻せません。</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>キャンセル</Button>
              <Button colorPalette="red" size="sm" loading={deleting}
                onClick={() => deleteTarget && void removePost({ variables: { id: deleteTarget.id } })}>
                削除する
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Container>
  );
}
