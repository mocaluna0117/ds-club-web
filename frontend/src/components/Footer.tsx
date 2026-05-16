import { Box, Text } from '@chakra-ui/react';

export function Footer() {
  return (
    <Box as="footer" py={8} textAlign="center" borderTop="1px solid" borderColor="gray.200" bg="gray.50">
      <Text fontSize="sm" color="gray.400">
        © {new Date().getFullYear()} DS Club. All rights reserved.
      </Text>
    </Box>
  );
}
