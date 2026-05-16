import { useState } from 'react';
import { Navigate, Link as RouterLink } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
  Container, Heading, Text, Box, Button, HStack, VStack,
  Flex, Badge, Spinner, Center, SimpleGrid, Dialog, Tabs,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import {
  GET_ALL_POSTS_ADMIN, GET_CONTACTS, GET_MEMBERS,
  REMOVE_POST, UPDATE_POST, MARK_CONTACT_READ,
} from '../graphql/queries';

export function AdminPage() {
  const { token, adminName } = useAuth();

  const { data: postsData, loading: postsLoading, refetch: refetchPosts } =
    useQuery(GET_ALL_POSTS_ADMIN, { fetchPolicy: 'cache-and-network', skip: !token });
  const { data: contactsData, loading: contactsLoading, refetch: refetchContacts } =
    useQuery(GET_CONTACTS, { fetchPolicy: 'cache-and-network', skip: !token });
  const { data: membersData } =
    useQuery(GET_MEMBERS, { skip: !token });

  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);

  const [removePost, { loading: deleting }] = useMutation(REMOVE_POST, {
    onCompleted: () => { setDeleteTarget(null); void refetchPosts(); },
  });
  const [updatePost] = useMutation(UPDATE_POST, {
    onCompleted: () => void refetchPosts(),
  });
  const [markRead] = useMutation(MARK_CONTACT_READ, {
    onCompleted: () => void refetchContacts(),
  });

  if (!token) return <Navigate to="/login" replace />;

  const allPosts = postsData?.allPosts ?? [];
  const contacts = contactsData?.contacts ?? [];
  const members = membersData?.members ?? [];
  const unreadCount = contacts.filter((c) => !c.read).length;
  const blogPosts = allPosts.filter((p) => p.type === 'BLOG');
  const activityPosts = allPosts.filter((p) => p.type === 'ACTIVITY');

  return (
    <Container as="main" maxW="960px" py={12}>
      {/* ヘッダー */}
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading as="h1" size="2xl" color="gray.800">管理者ダッシュボード</Heading>
          <Text color="gray.500" mt={1}>ようこそ、{adminName} さん</Text>
        </Box>
      </Flex>

      {/* 統計カード */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mb={10}>
        <StatCard label="記事数" value={allPosts.length} color="blue" />
        <StatCard label="メンバー数" value={members.length} color="teal" />
        <StatCard label="未読問い合わせ" value={unreadCount} color={unreadCount > 0 ? 'orange' : 'gray'} />
        <StatCard label="下書き" value={allPosts.filter((p) => !p.published).length} color="purple" />
      </SimpleGrid>

      {/* 記事管理 */}
      <SectionCard title="記事管理" action={
        <HStack gap={2}>
          <Button asChild colorPalette="blue" size="sm">
            <RouterLink to="/admin/new-post">+ 技術記事</RouterLink>
          </Button>
          <Button asChild colorPalette="teal" size="sm">
            <RouterLink to="/admin/new-post?type=ACTIVITY">+ 活動記録</RouterLink>
          </Button>
        </HStack>
      }>
        {postsLoading ? (
          <Center py={6}><Spinner size="sm" /></Center>
        ) : (
          <Tabs.Root defaultValue="blog" size="sm">
            <Tabs.List mb={3}>
              <Tabs.Trigger value="blog">技術記事 ({blogPosts.length})</Tabs.Trigger>
              <Tabs.Trigger value="activity">活動記録 ({activityPosts.length})</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="blog">
              <PostList posts={blogPosts} onDelete={setDeleteTarget} onTogglePublish={(p) =>
                void updatePost({ variables: { id: p.id, input: { published: !p.published } } })
              } />
            </Tabs.Content>
            <Tabs.Content value="activity">
              <PostList posts={activityPosts} onDelete={setDeleteTarget} onTogglePublish={(p) =>
                void updatePost({ variables: { id: p.id, input: { published: !p.published } } })
              } />
            </Tabs.Content>
          </Tabs.Root>
        )}
      </SectionCard>

      {/* メンバー管理 */}
      <SectionCard title="メンバー管理" action={
        <Button asChild variant="outline" size="sm">
          <RouterLink to="/members">メンバーページへ →</RouterLink>
        </Button>
      }>
        <Text color="gray.500" fontSize="sm">現在 {members.length} 名が登録されています。メンバーの追加・編集・削除はメンバーページから行えます。</Text>
      </SectionCard>

      {/* お問い合わせ */}
      <SectionCard title={`お問い合わせ${unreadCount > 0 ? `（未読 ${unreadCount}件）` : ''}`}>
        {contactsLoading ? (
          <Center py={6}><Spinner size="sm" /></Center>
        ) : contacts.length === 0 ? (
          <Text color="gray.400" fontSize="sm">お問い合わせはまだありません</Text>
        ) : (
          <VStack gap={3} align="stretch">
            {contacts.map((c) => (
              <Box
                key={c.id}
                border="1px solid"
                borderColor={c.read ? 'gray.200' : 'orange.300'}
                borderRadius="lg"
                p={4}
                bg={c.read ? 'white' : 'orange.50'}
              >
                <Flex justify="space-between" align="start">
                  <Box>
                    <HStack gap={2} mb={1}>
                      {!c.read && <Badge colorPalette="orange" size="sm">未読</Badge>}
                      <Text fontWeight="bold" fontSize="sm">{c.name}</Text>
                      <Text color="gray.400" fontSize="xs">{c.email}</Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" whiteSpace="pre-wrap">{c.message}</Text>
                    <Text fontSize="xs" color="gray.400" mt={1}>
                      {new Date(c.createdAt).toLocaleDateString('ja-JP')}
                    </Text>
                  </Box>
                  {!c.read && (
                    <Button size="xs" variant="outline" onClick={() => void markRead({ variables: { id: c.id } })}>
                      既読にする
                    </Button>
                  )}
                </Flex>
              </Box>
            ))}
          </VStack>
        )}
      </SectionCard>

      {/* 削除確認ダイアログ */}
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

// --- 小コンポーネント ---

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl" p={5} textAlign="center">
      <Text fontSize="2xl" fontWeight="800" color={`${color}.500`}>{value}</Text>
      <Text fontSize="sm" color="gray.500" mt={1}>{label}</Text>
    </Box>
  );
}

function SectionCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl" p={6} mb={6}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading as="h2" size="md" color="gray.800">{title}</Heading>
        {action}
      </Flex>
      {children}
    </Box>
  );
}

type PostItem = {
  id: number;
  title: string;
  type: string;
  published: boolean;
  createdAt: string;
  author: { name: string };
};

function PostList({ posts, onDelete, onTogglePublish }: {
  posts: PostItem[];
  onDelete: (p: { id: number; title: string }) => void;
  onTogglePublish: (p: PostItem) => void;
}) {
  if (posts.length === 0) {
    return <Text color="gray.400" fontSize="sm">記事がありません</Text>;
  }
  return (
    <VStack gap={2} align="stretch">
      {posts.map((p) => (
        <Flex key={p.id} align="center" justify="space-between" py={2}
          borderBottom="1px solid" borderColor="gray.100" _last={{ border: 'none' }}>
          <Box flex={1} minW={0} mr={3}>
            <Text fontSize="sm" fontWeight="medium" color="gray.800" truncate>{p.title}</Text>
            <Text fontSize="xs" color="gray.400">
              {p.author.name} · {new Date(p.createdAt).toLocaleDateString('ja-JP')}
            </Text>
          </Box>
          <HStack gap={2} flexShrink={0}>
            <Badge colorPalette={p.published ? 'green' : 'gray'} size="sm">
              {p.published ? '公開中' : '下書き'}
            </Badge>
            <Button size="xs" variant="outline"
              onClick={() => onTogglePublish(p)}>
              {p.published ? '非公開にする' : '公開する'}
            </Button>
            <Button size="xs" colorPalette="red" variant="outline"
              onClick={() => onDelete({ id: p.id, title: p.title })}>
              削除
            </Button>
          </HStack>
        </Flex>
      ))}
    </VStack>
  );
}
