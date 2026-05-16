import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Dialog, Button, Input, VStack, HStack, Text, Box, Spinner, Center,
} from '@chakra-ui/react';
import { GET_TEMPLATES, CREATE_TEMPLATE, REMOVE_TEMPLATE } from '../../graphql/queries';

type PostType = 'BLOG' | 'ACTIVITY';

type Props = {
  open: boolean;
  onClose: () => void;
  type: PostType;
  currentTitle: string;
  currentContent: string;
  onApply: (title: string, content: string) => void;
};

export function TemplateModal({ open, onClose, type, currentTitle, currentContent, onApply }: Props) {
  const [tab, setTab] = useState<'select' | 'save'>('select');
  const [newName, setNewName] = useState('');

  const { data, loading, refetch } = useQuery(GET_TEMPLATES, {
    variables: { type },
    skip: !open,
  });

  const [createTemplate, { loading: creating }] = useMutation(CREATE_TEMPLATE, {
    onCompleted: () => {
      setNewName('');
      setTab('select');
      void refetch();
    },
  });

  const [removeTemplate] = useMutation(REMOVE_TEMPLATE, {
    onCompleted: () => void refetch(),
  });

  const handleSave = async () => {
    if (!newName.trim()) return;
    await createTemplate({
      variables: { input: { name: newName, type, titleTemplate: currentTitle, content: currentContent } },
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="520px">
          <Dialog.Header>
            <Dialog.Title>テンプレート</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body pb={6}>
            {/* タブ切り替え */}
            <HStack mb={4} gap={0} borderBottom="1px solid" borderColor="gray.200">
              <Button
                variant="ghost"
                size="sm"
                borderRadius="none"
                borderBottom={tab === 'select' ? '2px solid' : 'none'}
                borderColor="blue.500"
                color={tab === 'select' ? 'blue.600' : 'gray.500'}
                onClick={() => setTab('select')}
              >
                テンプレートを選ぶ
              </Button>
              <Button
                variant="ghost"
                size="sm"
                borderRadius="none"
                borderBottom={tab === 'save' ? '2px solid' : 'none'}
                borderColor="blue.500"
                color={tab === 'save' ? 'blue.600' : 'gray.500'}
                onClick={() => setTab('save')}
              >
                現在の内容を保存
              </Button>
            </HStack>

            {tab === 'select' && (
              <>
                {loading && <Center py={6}><Spinner size="sm" /></Center>}
                {!loading && data?.templates.length === 0 && (
                  <Center py={6}>
                    <Text color="gray.400" fontSize="sm">テンプレートはまだありません</Text>
                  </Center>
                )}
                <VStack gap={2} align="stretch">
                  {data?.templates.map((t) => (
                    <Box
                      key={t.id}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="lg"
                      px={4}
                      py={3}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      _hover={{ borderColor: 'blue.300', bg: 'blue.50' }}
                      transition="all 0.15s"
                    >
                      <Box>
                        <Text fontWeight="medium" fontSize="sm">{t.name}</Text>
                        {t.titleTemplate && (
                          <Text fontSize="xs" color="gray.400" mt={0.5}>タイトル: {t.titleTemplate}</Text>
                        )}
                      </Box>
                      <HStack gap={2}>
                        <Button
                          size="xs"
                          colorPalette="blue"
                          onClick={() => { onApply(t.titleTemplate, t.content); onClose(); }}
                        >
                          適用
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          colorPalette="red"
                          onClick={() => void removeTemplate({ variables: { id: t.id } })}
                        >
                          削除
                        </Button>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </>
            )}

            {tab === 'save' && (
              <VStack gap={4} align="stretch">
                <Text fontSize="sm" color="gray.500">現在エディタに入力している内容をテンプレートとして保存します</Text>
                <Input
                  placeholder="テンプレート名を入力（例: 技術解説テンプレ）..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  size="sm"
                />
                {currentTitle && (
                  <Text fontSize="xs" color="gray.400">タイトル「{currentTitle}」も保存されます</Text>
                )}
                <Button
                  colorPalette="blue"
                  size="sm"
                  onClick={() => void handleSave()}
                  loading={creating}
                  disabled={!newName.trim()}
                >
                  保存する
                </Button>
              </VStack>
            )}
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="outline" size="sm" onClick={onClose}>閉じる</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
