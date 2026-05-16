import { Navigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Heading, Text, SimpleGrid, Box, Button, HStack } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

export function AdminPage() {
  const { token, adminName } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  return (
    <Container as="main" maxW="960px" py={12}>
      <HStack justify="space-between" mb={8}>
        <Box>
          <Heading as="h1" size="2xl" color="gray.800">管理者ダッシュボード</Heading>
          <Text color="gray.500" mt={1}>ようこそ、{adminName} さん</Text>
        </Box>
        <Button asChild colorPalette="blue">
          <RouterLink to="/admin/new-post">+ 記事を書く</RouterLink>
        </Button>
      </HStack>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        {ADMIN_CARDS.map((card) => (
          <Box
            key={card.title}
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            p={6}
            cursor="pointer"
            _hover={{ boxShadow: 'md', borderColor: 'blue.200' }}
            transition="all 0.2s"
          >
            <Heading as="h2" size="md" mb={2} color="gray.800">{card.title}</Heading>
            <Text color="gray.500" fontSize="sm">{card.desc}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
}

const ADMIN_CARDS = [
  { title: 'メンバー管理', desc: 'メンバーの追加・編集・削除' },
  { title: '記事管理', desc: '技術記事・活動記録の作成・編集・公開' },
  { title: 'お問い合わせ', desc: '受信したお問い合わせの確認' },
];
