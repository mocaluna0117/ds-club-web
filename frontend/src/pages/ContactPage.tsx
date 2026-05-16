import { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  Container, Heading, Text, VStack, Input, Textarea, Button, Box,
} from '@chakra-ui/react';
import { Field } from '@chakra-ui/react';
import { SEND_CONTACT } from '../graphql/queries';

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sendContact, { loading, error }] = useMutation(SEND_CONTACT);

  const handleSubmit = async () => {
    await sendContact({ variables: { input: form } });
    setSent(true);
  };

  if (sent) {
    return (
      <Container as="main" maxW="600px" py={12}>
        <Box textAlign="center" py={16} color="gray.600">
          <Text fontSize="5xl" color="green.500" mb={4}>✓</Text>
          <Heading as="h2" size="xl" mb={3}>送信完了</Heading>
          <Text>お問い合わせを受け付けました。後ほどご連絡いたします。</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container as="main" maxW="600px" py={12}>
      <Heading as="h1" size="2xl" mb={2} color="gray.800">お問い合わせ</Heading>
      <Text color="gray.500" mb={8}>DS Clubへのご質問・ご相談はこちらから</Text>
      <Box as="form" onSubmit={(e) => { e.preventDefault(); void handleSubmit(); }}>
        <VStack gap={5} align="stretch">
          <Field.Root required>
            <Field.Label fontWeight="semibold" fontSize="sm">お名前</Field.Label>
            <Input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field.Root>
          <Field.Root required>
            <Field.Label fontWeight="semibold" fontSize="sm">メールアドレス</Field.Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field.Root>
          <Field.Root required>
            <Field.Label fontWeight="semibold" fontSize="sm">メッセージ</Field.Label>
            <Textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              minLength={10}
              h="140px"
              resize="vertical"
            />
          </Field.Root>
          {error && <Text color="red.500" fontSize="sm">送信に失敗しました。もう一度お試しください。</Text>}
          <Button type="submit" colorPalette="blue" loading={loading} size="lg">
            送信する
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}
