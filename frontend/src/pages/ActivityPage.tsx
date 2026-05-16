import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container, Heading, VStack, Box, Text, Image, Spinner, Center,
  Flex, Button, Dialog,
} from '@chakra-ui/react';
import { GET_ACTIVITIES, REMOVE_POST } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';

export function ActivityPage() {
  const { token } = useAuth();
  const { data, loading, error, refetch } = useQuery(GET_ACTIVITIES, { fetchPolicy: 'cache-and-network' });
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);

  const [removePost, { loading: deleting }] = useMutation(REMOVE_POST, {
    onCompleted: () => {
      setDeleteTarget(null);
      void refetch();
    },
  });

  if (loading) return <Center py={20}><Spinner size="xl" color="blue.500" /></Center>;
  if (error) return <Center py={20}><Text color="gray.500">エラーが発生しました。</Text></Center>;

  return (
    <Container as="main" maxW="800px" py={12}>
      <Flex justify="space-between" align="center" mb={2}>
        <Heading as="h1" size="2xl" color="gray.800">活動記録</Heading>
        {token && (
          <Button asChild colorPalette="teal" size="sm">
            <RouterLink to="/admin/new-post?type=ACTIVITY">+ 記事を書く</RouterLink>
          </Button>
        )}
      </Flex>
      <Text color="gray.500" mb={8}>サークルの普段の活動を記録しています</Text>
      {data?.activities.length === 0 && (
        <Center py={8}><Text color="gray.400">まだ活動記録がありません。</Text></Center>
      )}
      <VStack gap={6} align="stretch">
        {data?.activities.map((post) => (
          <Box key={post.id} position="relative">
            <RouterLink to={`/activities/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box
                display="flex"
                flexDir="column"
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="xl"
                overflow="hidden"
                _hover={{ boxShadow: 'md' }}
                transition="box-shadow 0.2s"
              >
                {post.coverImage && (
                  <Image src={post.coverImage} alt={post.title} h="200px" objectFit="cover" />
                )}
                <Box p={6}>
                  <Heading as="h2" size="lg" mb={2} color="gray.800">{post.title}</Heading>
                  {post.excerpt && <Text color="gray.500" lineHeight="tall" mb={4}>{post.excerpt}</Text>}
                  <Box display="flex" gap={4} color="gray.400" fontSize="sm">
                    <Text>{post.author.name}</Text>
                    <Text>{new Date(post.createdAt).toLocaleDateString('ja-JP')}</Text>
                  </Box>
                </Box>
              </Box>
            </RouterLink>
            {token && (
              <Button
                size="xs"
                colorPalette="red"
                variant="outline"
                position="absolute"
                top={3}
                right={3}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteTarget({ id: post.id, title: post.title }); }}
              >
                削除
              </Button>
            )}
          </Box>
        ))}
      </VStack>

      {/* 削除確認ダイアログ */}
      <Dialog.Root open={!!deleteTarget} onOpenChange={(e) => !e.open && setDeleteTarget(null)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>活動記録を削除</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>「{deleteTarget?.title}」を削除しますか？この操作は元に戻せません。</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>キャンセル</Button>
              <Button
                colorPalette="red"
                size="sm"
                loading={deleting}
                onClick={() => deleteTarget && void removePost({ variables: { id: deleteTarget.id } })}
              >
                削除する
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Container>
  );
}
