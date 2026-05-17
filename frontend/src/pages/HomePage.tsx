import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const BASE = import.meta.env.BASE_URL;

const FEATURES = [
  { icon: `${BASE}python_icon.png`, title: 'Pythonの学習', desc: 'Pythonの基礎からPandas, Numpy, Scikit-learnなどを勉強会を通じて学習' },
  { icon: `${BASE}data_analysis.png`, title: 'データ分析の学習', desc: '簡単なデータを使用しデータ分析の基礎を学習' },
  { icon: `${BASE}compe.png`, title: 'データ分析コンペへの参加', desc: 'KaggleやSignateなどのデータ分析コンペにチームで参加' },
  { icon: `${BASE}paiza_atcoder.png`, title: '競技プログラミング', desc: 'AtCoderやPaizaなどの競技プログラミングのコンテストに参加' },
];

export function HomePage() {
  return (
    <Box as="main">
      <Box
        as="section"
        bgGradient="to-br"
        gradientFrom="blue.700"
        gradientTo="purple.600"
        py={12}
        px={8}
        textAlign="center"
      >
        <VStack gap={5} maxW="640px" mx="auto">
          <Heading as="h1" size="3xl" color="white" fontWeight="extrabold">
            データサイエンス倶楽部 へようこそ
          </Heading>
          <HStack gap={3} flexWrap="wrap" justify="center">
            <Button
              asChild
              bg="white"
              color="blue.700"
              borderRadius="full"
              fontWeight="bold"
              px={6}
              size="md"
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
              px={6}
              size="md"
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              <RouterLink to="/blog">技術記事を読む</RouterLink>
            </Button>
          </HStack>
        </VStack>
      </Box>

      <Box as="section" bg="white">
        <Container maxW="900px" py={10}>
          <Heading as="h2" size="xl" textAlign="center" mb={7} color="gray.800">
            活動内容
          </Heading>
          <SimpleGrid columns={2} gap={6}>
            {FEATURES.map((f) => (
              <Box
                key={f.title}
                bg="gray.50"
                borderRadius="2xl"
                border="1px solid"
                borderColor="gray.200"
                display="flex"
                alignItems="stretch"
                overflow="hidden"
              >
                <Box display="flex" alignItems="center" justifyContent="center" bg="white" flexShrink={0} w="140px">
                  <img src={f.icon} alt={f.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }} />
                </Box>
                <Box textAlign="left" p={6} display="flex" flexDirection="column" justifyContent="center">
                  <Heading as="h3" size="md" mb={2} color="gray.800">{f.title}</Heading>
                  <Text color="gray.500" fontSize="md" lineHeight="tall">{f.desc}</Text>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}
