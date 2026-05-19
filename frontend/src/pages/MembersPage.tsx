import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Container, Heading, SimpleGrid, Box, Text, Spinner, Center, Link,
  Avatar, Button, Dialog, Field, Input, Textarea, VStack, HStack,
} from '@chakra-ui/react';
import { GET_MEMBERS, CREATE_MEMBER, UPDATE_MEMBER, REMOVE_MEMBER } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';

const ROLE_OPTIONS = ['メンバー', '代表', '運営', 'OB/OG'] as const;
const GRADE_OPTIONS = [
  { label: 'B1', value: 1 },
  { label: 'B2', value: 2 },
  { label: 'B3', value: 3 },
  { label: 'B4', value: 4 },
  { label: '既卒', value: 5 },
] as const;

function gradeLabel(grade: number) {
  return GRADE_OPTIONS.find((g) => g.value === grade)?.label ?? `${grade}`;
}

type MemberForm = {
  name: string;
  role: string;
  grade: number;
  bio: string;
  github: string;
  twitter: string;
};

const INITIAL_FORM: MemberForm = { name: '', role: 'メンバー', grade: 1, bio: '', github: '', twitter: '' };

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  fontSize: '1rem',
  background: 'white',
};

function MemberFormFields({ form, onChange }: {
  form: MemberForm;
  onChange: (form: MemberForm) => void;
}) {
  const set = (key: keyof MemberForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    onChange({ ...form, [key]: key === 'grade' ? Number(e.target.value) : e.target.value });

  return (
    <VStack gap={4} align="stretch">
      <Field.Root required>
        <Field.Label fontSize="sm">名前</Field.Label>
        <Input value={form.name} onChange={set('name')} fontSize="16px" />
      </Field.Root>
      <Field.Root required>
        <Field.Label fontSize="sm">役割</Field.Label>
        <select value={form.role} onChange={set('role')} style={selectStyle}>
          {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </Field.Root>
      <Field.Root required>
        <Field.Label fontSize="sm">学年</Field.Label>
        <select value={form.grade} onChange={set('grade')} style={selectStyle}>
          {GRADE_OPTIONS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select>
      </Field.Root>
      <Field.Root>
        <Field.Label fontSize="sm">自己紹介</Field.Label>
        <Textarea value={form.bio} onChange={set('bio')} h="80px" resize="none" fontSize="16px" />
      </Field.Root>
      <Field.Root>
        <Field.Label fontSize="sm">GitHub ユーザー名</Field.Label>
        <Input value={form.github} onChange={set('github')} placeholder="username" fontSize="16px" />
      </Field.Root>
      <Field.Root>
        <Field.Label fontSize="sm">X ユーザー名</Field.Label>
        <Input value={form.twitter} onChange={set('twitter')} placeholder="username" fontSize="16px" />
      </Field.Root>
    </VStack>
  );
}

export function MembersPage() {
  const { token } = useAuth();
  const { data, loading, error } = useQuery(GET_MEMBERS);

  const [createMember, { loading: creating, error: createError }] = useMutation(CREATE_MEMBER, {
    refetchQueries: [GET_MEMBERS],
  });
  const [updateMember, { loading: updating, error: updateError }] = useMutation(UPDATE_MEMBER, {
    refetchQueries: [GET_MEMBERS],
  });
  const [removeMember, { loading: removing }] = useMutation(REMOVE_MEMBER, {
    refetchQueries: [GET_MEMBERS],
  });

  const [createForm, setCreateForm] = useState<MemberForm>(INITIAL_FORM);
  const [editTarget, setEditTarget] = useState<{ id: number } & MemberForm | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const handleCreate = async () => {
    await createMember({
      variables: {
        input: {
          name: createForm.name,
          role: createForm.role,
          grade: createForm.grade,
          bio: createForm.bio || null,
          github: createForm.github || null,
          twitter: createForm.twitter || null,
        },
      },
    });
    setCreateForm(INITIAL_FORM);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await removeMember({ variables: { id: deleteTarget.id } });
    setDeleteTarget(null);
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    await updateMember({
      variables: {
        id: editTarget.id,
        input: {
          name: editTarget.name,
          role: editTarget.role,
          grade: editTarget.grade,
          bio: editTarget.bio || null,
          github: editTarget.github || null,
          twitter: editTarget.twitter || null,
        },
      },
    });
    setEditTarget(null);
  };

  if (loading) return <Center py={20}><Spinner size="xl" color="blue.500" /></Center>;
  if (error) return <Center py={20}><Text color="gray.500">エラーが発生しました。</Text></Center>;

  return (
    <Container as="main" maxW="960px" py={12}>
      <HStack justify="space-between" mb={8}>
        <Heading as="h1" size="2xl" color="gray.800">メンバー紹介</Heading>
        {token && (
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button colorPalette="blue">+ メンバーを追加</Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content maxW="480px">
                <Dialog.Header>
                  <Dialog.Title>メンバーを追加</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <Box as="form" id="create-member-form" onSubmit={(e) => { e.preventDefault(); void handleCreate(); }}>
                    <MemberFormFields form={createForm} onChange={setCreateForm} />
                    {createError && <Text color="red.500" fontSize="sm" mt={2}>追加に失敗しました。</Text>}
                  </Box>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline">キャンセル</Button>
                  </Dialog.ActionTrigger>
                  <Button type="submit" form="create-member-form" colorPalette="blue" loading={creating}>
                    追加する
                  </Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger />
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>
        )}
      </HStack>

      {/* 編集 Dialog（open を state で制御） */}
      <Dialog.Root
        open={editTarget !== null}
        onOpenChange={({ open }) => { if (!open) setEditTarget(null); }}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="480px">
            <Dialog.Header>
              <Dialog.Title>メンバーを編集</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Box as="form" id="edit-member-form" onSubmit={(e) => { e.preventDefault(); void handleUpdate(); }}>
                {editTarget && (
                  <MemberFormFields
                    form={editTarget}
                    onChange={(f) => setEditTarget({ ...editTarget, ...f })}
                  />
                )}
                {updateError && <Text color="red.500" fontSize="sm" mt={2}>更新に失敗しました。</Text>}
              </Box>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">キャンセル</Button>
              </Dialog.ActionTrigger>
              <Button type="submit" form="edit-member-form" colorPalette="blue" loading={updating}>
                保存する
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {/* 削除確認 Dialog */}
      <Dialog.Root
        open={deleteTarget !== null}
        onOpenChange={({ open }) => { if (!open) setDeleteTarget(null); }}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="400px">
            <Dialog.Header>
              <Dialog.Title>メンバーを削除</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>「{deleteTarget?.name}」を削除しますか？この操作は元に戻せません。</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">キャンセル</Button>
              </Dialog.ActionTrigger>
              <Button colorPalette="red" loading={removing} onClick={() => void handleDelete()}>
                削除する
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

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
            <Text color="gray.400" fontSize="xs" mb={3}>{gradeLabel(m.grade)}</Text>
            {m.bio && <Text color="gray.500" fontSize="sm" lineHeight="tall" mb={4}>{m.bio}</Text>}
            <Box display="flex" gap={3} justifyContent="center" mb={token ? 3 : 0}>
              {m.github && (
                <Link href={`https://github.com/${m.github}`} target="_blank" rel="noopener noreferrer" color="blue.500" fontSize="sm">
                  GitHub
                </Link>
              )}
              {m.twitter && (
                <Link href={`https://twitter.com/${m.twitter}`} target="_blank" rel="noopener noreferrer" color="blue.500" fontSize="sm">
                  X
                </Link>
              )}
            </Box>
            {token && (
              <HStack gap={2} justify="center">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => setEditTarget({
                    id: m.id,
                    name: m.name,
                    role: m.role,
                    grade: m.grade,
                    bio: m.bio ?? '',
                    github: m.github ?? '',
                    twitter: m.twitter ?? '',
                  })}
                >
                  編集
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  colorPalette="red"
                  onClick={() => setDeleteTarget({ id: m.id, name: m.name })}
                >
                  削除
                </Button>
              </HStack>
            )}
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
}
