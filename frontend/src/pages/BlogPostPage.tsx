import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container, Heading, Text, Image, Spinner, Center, Box, Link,
  Button, Flex, Dialog,
} from '@chakra-ui/react';
import 'katex/dist/katex.min.css';
import { GET_POST, REMOVE_POST } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';

export function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id: Number(id) },
  });

  const [removePost, { loading: deleting }] = useMutation(REMOVE_POST, {
    onCompleted: () => {
      navigate(post.type === 'ACTIVITY' ? '/activities' : '/blog');
    },
  });

  if (loading) return <Center py={20}><Spinner size="xl" color="blue.500" /></Center>;
  if (error) return <Center py={20}><Text color="gray.500">記事が見つかりませんでした。</Text></Center>;

  const post = data!.post;
  const backTo = post.type === 'ACTIVITY' ? '/activities' : '/blog';
  const backLabel = post.type === 'ACTIVITY' ? '← 活動記録一覧へ' : '← 技術記事一覧へ';

  return (
    <Container as="main" maxW="760px" py={12}>
      <Flex justify="space-between" align="center" mb={6}>
        <Link asChild color="blue.500" fontSize="sm">
          <RouterLink to={backTo}>{backLabel}</RouterLink>
        </Link>
        {token && (
          <Button size="xs" colorPalette="red" variant="outline" onClick={() => setDeleteOpen(true)}>
            削除
          </Button>
        )}
      </Flex>

      {post.coverImage && (
        <Image src={post.coverImage} alt={post.title} w="full" borderRadius="xl" mb={8} maxH="400px" objectFit="cover" />
      )}
      <Heading as="h1" size="2xl" fontWeight="extrabold" color="gray.800" mb={3}>
        {post.title}
      </Heading>
      <Box display="flex" gap={4} color="gray.400" fontSize="sm" mb={8}>
        <Text>{post.author.name}</Text>
        <Text>{new Date(post.createdAt).toLocaleDateString('ja-JP')}</Text>
      </Box>
      <Box
        lineHeight="tall"
        color="gray.700"
        dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
      />

      {/* 削除確認ダイアログ */}
      <Dialog.Root open={deleteOpen} onOpenChange={(e) => !e.open && setDeleteOpen(false)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>記事を削除</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>「{post.title}」を削除しますか？この操作は元に戻せません。</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" size="sm" onClick={() => setDeleteOpen(false)}>キャンセル</Button>
              <Button
                colorPalette="red"
                size="sm"
                loading={deleting}
                onClick={() => void removePost({ variables: { id: Number(id) } })}
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
