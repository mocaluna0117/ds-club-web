import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Button, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { PageTitle } from '../components/PageTitle';

const BASE = import.meta.env.BASE_URL;

type Feature = {
  icon: string;
  title: string;
  desc: string;
  /** 内部ページへ遷移（カード全体がクリック可能） */
  to?: string;
  /** 外部サイトへ遷移（カード全体がクリック可能・新規タブ） */
  href?: string;
  /** カード下部に表示する誘導テキスト */
  linkLabel?: string;
  /** 遷移先が複数ある場合（カード自体ではなく個別リンクをクリック） */
  links?: { label: string; href: string }[];
};

const FEATURES: Feature[] = [
  {
    icon: `${BASE}python_icon.png`,
    title: 'Pythonの学習',
    desc: 'Pythonの基礎からPandas, Numpy, Scikit-learnなどを勉強会を通じて学習',
    to: '/activities',
    linkLabel: '活動記録を見る →',
  },
  {
    icon: `${BASE}data_analysis.png`,
    title: 'データ分析の学習',
    desc: '簡単なデータを使用しデータ分析の基礎を学習',
    to: '/blog',
    linkLabel: '技術記事を見る →',
  },
  {
    icon: `${BASE}compe.png`,
    title: 'データ分析コンペへの参加',
    desc: 'KaggleやSignateなどのデータ分析コンペにチームで参加',
    links: [
      { label: 'Kaggle →', href: 'https://www.kaggle.com/' },
      { label: 'SIGNATE →', href: 'https://signate.jp/' },
    ],
  },
  {
    icon: `${BASE}paiza_atcoder.png`,
    title: '競技プログラミング',
    desc: 'AtCoderやPaizaなどの競技プログラミングのコンテストに参加',
    href: 'https://r1ku169.github.io/shojin-dashboard/#/',
    linkLabel: '精進ボードを見る →',
  },
];

export function HomePage() {
  return (
    <Box as="main">
      <PageTitle />
      <Box
        as="section"
        bgGradient="to-br"
        gradientFrom="blue.700"
        gradientTo="purple.600"
        py={{ base: 8, md: 12 }}
        px={{ base: 4, md: 8 }}
        textAlign="center"
      >
        <VStack gap={5} maxW="640px" mx="auto">
          <Heading
            as="h1"
            fontSize={{ base: '5.5vw', md: '3rem' }}
            color="white"
            fontWeight="extrabold"
            whiteSpace="nowrap"
          >
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
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} feature={f} />
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}

function FeatureCard({ feature: f }: { feature: Feature }) {
  const clickable = !!(f.to || f.href);
  const card = (
    <Box
      bg="gray.50"
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.200"
      display="flex"
      alignItems="stretch"
      overflow="hidden"
      h="100%"
      transition="all 0.2s"
      {...(clickable && {
        cursor: 'pointer',
        _hover: { borderColor: 'blue.300', boxShadow: 'md', transform: 'translateY(-2px)' },
      })}
    >
      <Box display="flex" alignItems="center" justifyContent="center" bg="white" flexShrink={0} w={{ base: '100px', md: '140px' }}>
        <img src={f.icon} alt={f.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }} />
      </Box>
      <Box textAlign="left" p={{ base: 4, md: 6 }} display="flex" flexDirection="column" justifyContent="center">
        <Heading as="h3" size="md" mb={2} color="gray.800">{f.title}</Heading>
        <Text color="gray.500" fontSize={{ base: 'sm', md: 'md' }} lineHeight="tall">{f.desc}</Text>
        {f.linkLabel && (
          <Text color="blue.600" fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }} mt={2}>
            {f.linkLabel}
          </Text>
        )}
        {f.links && (
          <HStack gap={4} mt={2} flexWrap="wrap">
            {f.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                color="blue.600"
                fontWeight="bold"
                fontSize={{ base: 'sm', md: 'md' }}
              >
                {l.label}
              </Link>
            ))}
          </HStack>
        )}
      </Box>
    </Box>
  );

  if (f.to) {
    return (
      <RouterLink to={f.to} style={{ textDecoration: 'none', display: 'block' }}>
        {card}
      </RouterLink>
    );
  }
  if (f.href) {
    return (
      <a href={f.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
        {card}
      </a>
    );
  }
  return card;
}
