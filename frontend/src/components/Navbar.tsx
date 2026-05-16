import { Box, Flex, HStack, Button } from '@chakra-ui/react';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { adminName, logout } = useAuth();

  return (
    <Box as="nav" bg="white" borderBottom="1px solid" borderColor="gray.200" position="sticky" top={0} zIndex={100}>
      <Flex maxW="960px" mx="auto" px={6} py={4} align="center" justify="space-between">
        <RouterLink to="/" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#2563eb', textDecoration: 'none' }}>
          DS Club
        </RouterLink>
        <HStack gap={6} align="center">
          <NavItem to="/" end>ホーム</NavItem>
          <NavItem to="/members">メンバー</NavItem>
          <NavItem to="/blog">ブログ</NavItem>
          <NavItem to="/contact">お問い合わせ</NavItem>
          {adminName ? (
            <>
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
      })}
    >
      {children}
    </NavLink>
  );
}
