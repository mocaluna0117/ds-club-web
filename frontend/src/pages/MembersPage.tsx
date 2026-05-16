import { useQuery } from '@apollo/client';
import { Container, Heading, SimpleGrid, Box, Text, Spinner, Center, Link } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/react';
import { GET_MEMBERS } from '../graphql/queries';

export function MembersPage() {
  const { data, loading, error } = useQuery(GET_MEMBERS);

  if (loading) return <Center py={20}><Spinner size="xl" color="blue.500" /></Center>;
  if (error) return <Center py={20}><Text color="gray.500">エラーが発生しました。</Text></Center>;

  return (
    <Container as="main" maxW="960px" py={12}>
      <Heading as="h1" size="2xl" mb={8} color="gray.800">メンバー紹介</Heading>
      {(data?.members ?? []).length === 0 && (
        <Center py={8}><Text color="gray.400">まだメンバーがいません。</Text></Center>
      )}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={6}>
        {(data?.members ?? []).map((m) => (
          <Box
            key={m.id}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            p={6}
            textAlign="center"
          >
            <Box mb={4} display="flex" justifyContent="center">
              <Avatar.Root size="xl">
                {m.imageUrl
                  ? <Avatar.Image src={m.imageUrl} />
                  : <Avatar.Fallback>{m.name[0]}</Avatar.Fallback>
                }
              </Avatar.Root>
            </Box>
            <Heading as="h2" size="md" mb={1} color="gray.800">{m.name}</Heading>
            <Text color="blue.600" fontWeight="semibold" fontSize="sm" mb={1}>{m.role}</Text>
            <Text color="gray.400" fontSize="xs" mb={3}>{m.grade}回生</Text>
            {m.bio && <Text color="gray.500" fontSize="sm" lineHeight="tall" mb={4}>{m.bio}</Text>}
            <Box display="flex" gap={3} justifyContent="center">
              {m.github && (
                <Link href={`https://github.com/${m.github}`} target="_blank" rel="noopener noreferrer" color="blue.500" fontSize="sm">
                  GitHub
                </Link>
              )}
              {m.twitter && (
                <Link href={`https://twitter.com/${m.twitter}`} target="_blank" rel="noopener noreferrer" color="blue.500" fontSize="sm">
                  Twitter
                </Link>
              )}
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
}
