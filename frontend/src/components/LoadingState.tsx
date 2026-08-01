import { Button, Center, Spinner, Text, VStack } from '@chakra-ui/react';
import { useSlowFlag } from '../lib/useSlowFlag';

/**
 * データ取得中の表示。
 *
 * Render 無料プランのスピンアップは約1分かかるため、無言のスピナーだと「壊れている」と
 * 受け取られてしまう。数秒待たされたら理由を示し、1分を超えたら「永遠に読み込み中」に
 * ならないよう再試行の手段を出す (Apollo 側にタイムアウトが無いため)。
 */
export function LoadingState({ onRetry }: { onRetry?: () => void }) {
  const slow = useSlowFlag(true, 4000);
  const stalled = useSlowFlag(true, 65000);

  return (
    <Center py={20} px={4}>
      <VStack gap={4}>
        {!stalled && <Spinner size="xl" color="blue.500" />}
        {slow && !stalled && (
          <VStack gap={1} textAlign="center">
            <Text color="gray.600" fontSize="sm" fontWeight="semibold">
              サーバーを起動しています
            </Text>
            <Text color="gray.600" fontSize="xs">
              しばらく利用がなかったため、最大1分ほどかかることがあります
            </Text>
          </VStack>
        )}
        {stalled && (
          <VStack gap={3} textAlign="center">
            <Text color="gray.600" fontSize="sm" fontWeight="semibold">
              サーバーの起動に失敗した可能性があります
            </Text>
            <Button size="sm" variant="outline" onClick={onRetry ?? (() => window.location.reload())}>
              再試行する
            </Button>
          </VStack>
        )}
      </VStack>
    </Center>
  );
}
