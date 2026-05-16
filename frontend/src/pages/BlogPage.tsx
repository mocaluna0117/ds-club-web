import { useQuery } from '@apollo/client';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Heading, VStack, Box, Text, Image, Spinner, Center } from '@chakra-ui/react';
import { GET_POSTS } from '../graphql/queries';

interface Post {
  id: number;
  title: string;
  excerpt?: string;
  coverImage?: string;
  createdAt: string;
  author: { name: string };
}

export function BlogPage() {
  const { data, loading, error } = useQuery<{ posts: Post[] }>(GET_POSTS);

  if (loading) return <Center py={20}><Spinner size="xl" color="blue.500" /></Center>;
  if (error) return <Center py={20}><Text color="gray.500">エラーが発生しました。</Text></Center>;

  return (
    <Container as="main" maxW="800px" py={12}>
      <Heading as="h1" size="2xl" mb={8} color="gray.800">ブログ・活動記録</Heading>
      {data?.posts.length === 0 && (
        <Center py={8}><Text color="gray.400">まだ記事がありません。</Text></Center>
      )}
      <VStack gap={6} align="stretch">
        {data?.posts.map((post) => (
          <RouterLink key={post.id} to={`/blog/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
        ))}
      </VStack>
    </Container>
  );
}
