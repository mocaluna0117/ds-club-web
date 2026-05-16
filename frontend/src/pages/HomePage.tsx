import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const FEATURES = [
  { icon: '📊', title: 'データ分析', desc: '実データを使った分析プロジェクトを定期開催' },
  { icon: '🤖', title: '機械学習', desc: 'ML/DLの理論から実装まで勉強会で学習' },
  { icon: '🏆', title: 'コンペ参加', desc: 'Kaggle等のコンペにチームで挑戦' },
];

export function HomePage() {
  return (
    <Box as="main">
      <Box
        as="section"
        bgGradient="to-br"
        gradientFrom="blue.700"
        gradientTo="purple.600"
        py={24}
        px={8}
        textAlign="center"
      >
        <VStack gap={6} maxW="640px" mx="auto">
          <Heading as="h1" size="4xl" color="white" fontWeight="extrabold">
            データサイエンス倶楽部 へようこそ
          </Heading>
          <Text fontSize="xl" color="blue.100">
            データサイエンスを学び、実践し、共に成長するコミュニティ
          </Text>
          <HStack gap={4} flexWrap="wrap" justify="center">
            <Button
              asChild
              bg="white"
              color="blue.700"
              borderRadius="full"
              fontWeight="bold"
              px={8}
              size="lg"
              _hover={{ bg: 'blue.50' }}
            >
              <RouterLink to="/members">メンバーを見る</RouterLink>
            </Button>
            <Button
              asChild
              variant="outline"
              color="white"
              borderColor="whiteAlpha.600"
              borderRadius="full"
              fontWeight="bold"
              px={8}
              size="lg"
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              <RouterLink to="/blog">ブログを読む</RouterLink>
            </Button>
          </HStack>
        </VStack>
      </Box>

      <Container as="section" maxW="960px" py={16}>
        <Heading as="h2" size="2xl" textAlign="center" mb={10} color="gray.800">
          活動内容
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          {FEATURES.map((f) => (
            <Box
              key={f.title}
              p={8}
              bg="gray.50"
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.200"
              textAlign="center"
            >
              <Text fontSize="4xl" mb={4}>{f.icon}</Text>
              <Heading as="h3" size="md" mb={2} color="gray.800">{f.title}</Heading>
              <Text color="gray.500" lineHeight="tall">{f.desc}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
