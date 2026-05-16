import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Heading, Text, Image, Spinner, Center, Box, Link } from '@chakra-ui/react';
import { GET_POST } from '../graphql/queries';

interface Post {
  id: number;
  title: string;
  content: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  author: { name: string };
}

export function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<{ post: Post }>(GET_POST, {
    variables: { id: Number(id) },
  });

  if (loading) return <Center py={20}><Spinner size="xl" color="blue.500" /></Center>;
  if (error) return <Center py={20}><Text color="gray.500">記事が見つかりませんでした。</Text></Center>;

  const post = data!.post;

  return (
    <Container as="main" maxW="760px" py={12}>
      <Link asChild color="blue.500" fontSize="sm" display="block" mb={6}>
        <RouterLink to="/blog">← ブログ一覧へ</RouterLink>
      </Link>
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
    </Container>
  );
}
