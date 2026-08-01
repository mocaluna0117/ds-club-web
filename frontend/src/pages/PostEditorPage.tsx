import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, Navigate, useSearchParams, useParams } from 'react-router-dom';
import {
  Container, Heading, VStack, Input, Button, HStack,
  Box, Text, Flex, Badge,
} from '@chakra-ui/react';
import { Field } from '@chakra-ui/react';
import { RichTextEditor } from '../components/editor/RichTextEditor';
import { TemplateModal } from '../components/editor/TemplateModal';
import { CREATE_POST, UPDATE_POST, GET_POST } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/LoadingState';
import { useApiWarming } from '../lib/warmApi';
import { clearDraft, draftKeyFor, formatSavedAt, loadDraft, saveDraft } from '../lib/draftStorage';

export function PostEditorPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  // 執筆中にスピンダウンして保存時に1分待たされるのを防ぐ
  useApiWarming({ heartbeat: true });

  const [createPost, { loading: creating }] = useMutation(CREATE_POST);
  const [updatePost, { loading: updating }] = useMutation(UPDATE_POST);
  const loading = creating || updating;

  const {
    data: postData,
    loading: postLoading,
    error: postError,
    refetch: refetchPost,
  } = useQuery(GET_POST, {
    variables: { id: Number(id) },
    skip: !isEdit,
    // エディタは必ずサーバーの最新内容から編集を始める。
    // キャッシュ(ビルド時スナップショット由来)を元に編集すると、古い内容で上書き保存してしまう
    fetchPolicy: 'network-only',
  });

  const type: 'BLOG' | 'ACTIVITY' =
    postData?.post?.type === 'ACTIVITY'
      ? 'ACTIVITY'
      : searchParams.get('type') === 'ACTIVITY'
      ? 'ACTIVITY'
      : 'BLOG';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [templateOpen, setTemplateOpen] = useState(false);
  // 新規作成は読み込むものが無いので最初から初期化済み扱い
  const [initialized, setInitialized] = useState(!isEdit);

  const draftKey = draftKeyFor(id, type);
  const [pendingDraft, setPendingDraft] = useState(() => loadDraft(draftKeyFor(id, type)));

  useEffect(() => {
    if (isEdit && postData?.post && !initialized) {
      setTitle(postData.post.title);
      setContent(postData.post.content);
      setInitialized(true);
    }
  }, [isEdit, postData, initialized]);

  // サーバーの内容から変化した分だけを下書きとして退避する。
  // 保存時に API がコールドスタートで待たされたり失敗しても、書いた内容が消えないようにする
  const serverTitle = isEdit ? postData?.post?.title ?? '' : '';
  const serverContent = isEdit ? postData?.post?.content ?? '' : '';
  const dirty = initialized && (title !== serverTitle || content !== serverContent);

  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => saveDraft(draftKey, { title, content }), 1000);
    return () => clearTimeout(t);
  }, [dirty, draftKey, title, content]);

  if (!token) return <Navigate to="/login" replace />;
  if (isEdit && postLoading && !postData) return <LoadingState onRetry={() => void refetchPost()} />;
  // 取得に失敗したまま空のエディタを開かせない。
  // 開いてしまうと、そのまま保存した瞬間に本文が空で上書きされ、元に戻せない
  if (isEdit && !postData) {
    return (
      <Container maxW="800px" py={16}>
        <VStack gap={4}>
          <Text color="gray.700" fontWeight="semibold">記事を読み込めませんでした</Text>
          <Text color="gray.600" fontSize="sm" textAlign="center">
            {postError
              ? 'サーバーに接続できなかったか、記事が見つかりませんでした。'
              : '記事が見つかりませんでした。'}
            <br />
            この状態では編集できません(空の内容で上書きしてしまうため)。
          </Text>
          <HStack gap={3}>
            <Button size="sm" colorPalette="blue" onClick={() => void refetchPost()}>
              再試行する
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate('/admin')}>
              管理画面へ戻る
            </Button>
          </HStack>
        </VStack>
      </Container>
    );
  }

  const handleSubmit = async (publish: boolean) => {
    if (!title.trim()) return;
    // 読み込みが終わる前の保存は、空の内容でサーバーを上書きしてしまう
    if (isEdit && !initialized) return;

    if (isEdit) {
      const { data } = await updatePost({
        variables: {
          id: Number(id),
          // 「更新する」のみ published: true を送る。下書き保存は published を変えない
          input: publish ? { title, content, published: true } : { title, content },
        },
        refetchQueries: [{ query: GET_POST, variables: { id: Number(id) } }],
        awaitRefetchQueries: true,
      });
      if (data) {
        clearDraft(draftKey);
        navigate(type === 'ACTIVITY' ? `/activities/${id}` : `/blog/${id}`);
      }
    } else {
      const { data } = await createPost({
        variables: { input: { title, content, type, published: publish } },
      });
      if (data) {
        clearDraft(draftKey);
        navigate(type === 'ACTIVITY' ? '/activities' : '/blog');
      }
    }
  };

  const restoreDraft = () => {
    if (!pendingDraft) return;
    setTitle(pendingDraft.title);
    setContent(pendingDraft.content);
    setPendingDraft(null);
  };

  const discardDraft = () => {
    clearDraft(draftKey);
    setPendingDraft(null);
  };

  // いま表示している内容と同じ下書きなら知らせる意味がない
  const showDraftBanner =
    !!pendingDraft && (pendingDraft.title !== title || pendingDraft.content !== content);

  return (
    <Container maxW="800px" py={10}>
      <VStack gap={6} align="stretch">
        <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} flexDir={{ base: 'column', md: 'row' }} gap={3}>
          <HStack gap={3} align="center">
            {/* モバイルのみ: テキストリンクで戻る */}
            <Box
              as="button"
              display={{ base: 'block', md: 'none' }}
              onClick={() => navigate(
                isEdit
                  ? (type === 'ACTIVITY' ? `/activities/${id}` : `/blog/${id}`)
                  : (type === 'ACTIVITY' ? '/activities' : '/blog')
              )}
              color="blue.600"
              fontSize="sm"
              fontWeight="semibold"
              flexShrink={0}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              ← 戻る
            </Box>
            <Heading as="h1" size={{ base: 'lg', md: 'xl' }} color="gray.800">
              {isEdit
                ? type === 'ACTIVITY' ? '活動記録を編集' : '技術記事を編集'
                : type === 'ACTIVITY' ? '新しい活動記録' : '新しい技術記事'}
            </Heading>
            <Badge
              colorPalette={type === 'ACTIVITY' ? 'teal' : 'blue'}
              size="md"
              borderRadius="full"
            >
              {type === 'ACTIVITY' ? '活動記録' : '技術記事'}
            </Badge>
          </HStack>
          <HStack gap={3} flexWrap="wrap">
            {/* デスクトップのみ: ボタンで戻る */}
            {isEdit && (
              <Button display={{ base: 'none', md: 'flex' }} variant="outline" size="sm" onClick={() => navigate(type === 'ACTIVITY' ? `/activities/${id}` : `/blog/${id}`)}>
                ← 戻る
              </Button>
            )}
            {!isEdit && (
              <>
                <Button display={{ base: 'none', md: 'flex' }} variant="outline" size="sm" onClick={() => navigate(type === 'ACTIVITY' ? '/activities' : '/blog')}>
                  ← 戻る
                </Button>
                <Button variant="outline" size="sm" onClick={() => setTemplateOpen(true)}>
                  テンプレート
                </Button>
                <Button variant="outline" size="sm" onClick={() => void handleSubmit(false)} loading={loading}>
                  非公開で保存
                </Button>
              </>
            )}
            <Button
              colorPalette={type === 'ACTIVITY' ? 'teal' : 'blue'}
              size="sm"
              onClick={() => void handleSubmit(true)}
              loading={loading}
              disabled={!title.trim()}
            >
              {isEdit ? '変更を保存' : '公開する'}
            </Button>
          </HStack>
        </Flex>

        {showDraftBanner && (
          <Flex
            bg="orange.50"
            border="1px solid"
            borderColor="orange.200"
            borderRadius="lg"
            px={4}
            py={3}
            align={{ base: 'flex-start', md: 'center' }}
            justify="space-between"
            gap={3}
            flexDir={{ base: 'column', md: 'row' }}
          >
            <Text fontSize="sm" color="gray.700">
              保存されていない下書きがあります（{formatSavedAt(pendingDraft.savedAt)}に自動保存）
            </Text>
            <HStack gap={2} flexShrink={0}>
              <Button size="xs" colorPalette="orange" onClick={restoreDraft}>
                復元する
              </Button>
              <Button size="xs" variant="outline" onClick={discardDraft}>
                破棄する
              </Button>
            </HStack>
          </Flex>
        )}

        <Field.Root required>
          <Input
            placeholder="タイトルを入力..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fontSize="1.5rem"
            fontWeight="bold"
            border="none"
            borderBottom="2px solid"
            borderColor="gray.200"
            borderRadius="none"
            px={0}
            _focus={{ borderColor: type === 'ACTIVITY' ? 'teal.400' : 'blue.400', boxShadow: 'none' }}
          />
        </Field.Root>

        <Box
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          p={6}
          minH="500px"
          bg="white"
        >
          <RichTextEditor content={content} onChange={setContent} />
        </Box>

        <Text fontSize="xs" color="gray.600">
          <strong>/</strong> でコマンドメニューを開く
          　<strong>$$...$$</strong> で LaTeX 数式（例: <code>$$\int f(x)dx$$</code>）
        </Text>
      </VStack>

      {!isEdit && (
        <TemplateModal
          open={templateOpen}
          onClose={() => setTemplateOpen(false)}
          type={type}
          currentTitle={title}
          currentContent={content}
          onApply={(t, c) => { setTitle(t); setContent(c); }}
        />
      )}
    </Container>
  );
}
