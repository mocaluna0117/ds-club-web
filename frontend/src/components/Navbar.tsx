import { Box, Flex, HStack, Button, Badge, Text } from '@chakra-ui/react';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { adminName, logout } = useAuth();

  return (
    <Box as="nav" bg="white" borderBottom="1px solid" borderColor="gray.200" position="sticky" top={0} zIndex={100}>
      <Flex px={8} py={4} align="center" justify="space-between">
        <RouterLink to="/" style={{ fontSize: '1.1rem', fontWeight: '800', color: '#2563eb', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
          データサイエンス倶楽部
        </RouterLink>
        <HStack gap={4} align="center" flexShrink={0}>
          <NavItem to="/" end>ホーム</NavItem>
          <NavItem to="/members">メンバー</NavItem>
          <NavItem to="/blog">技術記事</NavItem>
          <NavItem to="/activities">活動記録</NavItem>
          <NavItem to="/contact">お問い合わせ</NavItem>
          {adminName ? (
            <>
              <HStack gap={2} align="center">
                <Badge colorPalette="blue" variant="subtle" px={2} py={1} borderRadius="md">
                  管理者
                </Badge>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700">{adminName}</Text>
              </HStack>
              <NavItem to="/admin">管理</NavItem>
              <Button size="sm" variant="outline" onClick={logout}>ログアウト</Button>
            </>
          ) : (
            <NavItem to="/login">管理者ログイン</NavItem>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}

function NavItem({ to, end, children }: { to: string; end?: boolean; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        textDecoration: 'none',
        fontWeight: isActive ? '700' : '400',
        color: isActive ? '#2563eb' : '#374151',
        fontSize: '0.95rem',
        whiteSpace: 'nowrap',
      })}
    >
      {children}
    </NavLink>
  );
}
