import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  Flex, Box, Heading, VStack, Input, Button, Text,
} from '@chakra-ui/react';
import { Field } from '@chakra-ui/react';
import { LOGIN } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';
import { useSlowFlag } from '../lib/useSlowFlag';
import { useApiWarming } from '../lib/warmApi';
import { consumeSessionExpiredFlag } from '../lib/authToken';
import { PageTitle } from '../components/PageTitle';

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [doLogin, { loading, error }] = useMutation(LOGIN);
  const slow = useSlowFlag(loading);
  // 期限切れで戻された場合は理由を伝える (読み取りは1回だけ)
  const [sessionExpired] = useState(() => consumeSessionExpiredFlag());

  // フォームを埋めている十数秒の間に API の起動を進めておく
  useApiWarming();

  const handleSubmit = async () => {
    const { data } = await doLogin({ variables: { input: form } });
    if (data) {
      login(data.login.accessToken, data.login.adminName);
      navigate('/admin');
    }
  };

  return (
    <Flex as="main" align="center" justify="center" minH="70vh" px={4}>
      <PageTitle title="管理者ログイン" />
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="2xl"
        p={10}
        w="full"
        maxW="420px"
      >
        <Heading as="h1" size="xl" mb={8} textAlign="center" color="gray.800">
          管理者ログイン
        </Heading>
        <Box as="form" onSubmit={(e) => { e.preventDefault(); void handleSubmit(); }}>
          <VStack gap={5} align="stretch">
            {sessionExpired && (
              <Box bg="orange.50" border="1px solid" borderColor="orange.200" borderRadius="md" px={3} py={2}>
                <Text color="gray.700" fontSize="sm">
                  ログインの有効期限が切れました。もう一度ログインしてください。
                </Text>
              </Box>
            )}
            <Field.Root required>
              <Field.Label fontWeight="semibold" fontSize="sm">メールアドレス</Field.Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />
            </Field.Root>
            <Field.Root required>
              <Field.Label fontWeight="semibold" fontSize="sm">パスワード</Field.Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                minLength={8}
                autoComplete="current-password"
              />
            </Field.Root>
            {error && (
              <Text color="red.500" fontSize="sm">
                メールアドレスまたはパスワードが違います。
              </Text>
            )}
            <Button type="submit" colorPalette="blue" loading={loading} size="lg">
              ログイン
            </Button>
            {slow && (
              <Text color="gray.500" fontSize="xs" textAlign="center">
                サーバーを起動しています。しばらく利用がなかったため、最大1分ほどかかることがあります。
              </Text>
            )}
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
}
