import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, Navigate, useSearchParams, useParams } from 'react-router-dom';
import {
  Container, Heading, VStack, Input, Button, HStack,
  Box, Text, Flex, Badge, Spinner, Center,
} from '@chakra-ui/react';
import { Field } from '@chakra-ui/react';
import { RichTextEditor } from '../components/editor/RichTextEditor';
import { TemplateModal } from '../components/editor/TemplateModal';
import { CREATE_POST, UPDATE_POST, GET_POST } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';

export function PostEditorPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [createPost, { loading: creating }] = useMutation(CREATE_POST);
  const [updatePost, { loading: updating }] = useMutation(UPDATE_POST);
  const loading = creating || updating;

  const { data: postData, loading: postLoading } = useQuery(GET_POST, {
    variables: { id: Number(id) },
    skip: !isEdit,
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
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isEdit && postData?.post && !initialized) {
      setTitle(postData.post.title);
      setContent(postData.post.content);
      setInitialized(true);
    }
  }, [isEdit, postData, initialized]);

  if (!token) return <Navigate to="/login" replace />;
  if (isEdit && postLoading) return <Center py={20}><Spinner size="xl" color="blue.500" /></Center>;

  const handleSubmit = async (publish: boolean) => {
    if (!title.trim()) return;

    if (isEdit) {
      const { data } = await updatePost({
        variables: {
          id: Number(id),
          // 「更新する」のみ published: true を送る。下書き保存は published を変えない
          input: publish ? { title, content, published: true } : { title, content },
        },
      });
      if (data) navigate(type === 'ACTIVITY' ? `/activities/${id}` : `/blog/${id}`);
    } else {
      const { data } = await createPost({
        variables: { input: { title, content, type, published: publish } },
      });
      if (data) navigate(type === 'ACTIVITY' ? '/activities' : '/blog');
    }
  };

  return (
    <Container maxW="800px" py={10}>
      <VStack gap={6} align="stretch">
        <Flex justify="space-between" align="center">
          <HStack gap={3}>
            <Heading as="h1" size="xl" color="gray.800">
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
          <HStack gap={3}>
            {!isEdit && (
              <Button variant="outline" size="sm" onClick={() => setTemplateOpen(true)}>
                テンプレート
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => void handleSubmit(false)} loading={loading}>
              下書き保存
            </Button>
            <Button
              colorPalette={type === 'ACTIVITY' ? 'teal' : 'blue'}
              size="sm"
              onClick={() => void handleSubmit(true)}
              loading={loading}
              disabled={!title.trim()}
            >
              {isEdit ? '更新する' : '公開する'}
            </Button>
          </HStack>
        </Flex>

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

        <Text fontSize="xs" color="gray.400">
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
