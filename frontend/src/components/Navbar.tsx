import { useState } from 'react';
import { Box, Flex, HStack, Button, Badge, Text, VStack } from '@chakra-ui/react';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'ホーム', end: true },
  { to: '/members', label: 'メンバー' },
  { to: '/blog', label: '技術記事' },
  { to: '/activities', label: '活動記録' },
  { to: '/contact', label: 'お問い合わせ' },
];

export function Navbar() {
  const { adminName, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <Box as="nav" bg="white" borderBottom="1px solid" borderColor="gray.200" position="sticky" top={0} zIndex={100}>
      {/* メインバー */}
      <Flex px={{ base: 4, md: 8 }} py={3} align="center" justify="space-between" position="relative">
        {/* ロゴ（アイコン + デスクトップのみテキスト） */}
        <RouterLink
          to="/"
          onClick={closeMenu}
          style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1 }}
        >
          <img
            src={`${import.meta.env.BASE_URL}ds_club_icon.png`}
            alt="データサイエンス倶楽部"
            style={{ height: '52px', objectFit: 'contain' }}
          />
          {/* デスクトップのみテキストをロゴの横に表示 */}
          <Box display={{ base: 'none', md: 'block' }}>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: '#2563eb', whiteSpace: 'nowrap' }}>
              データサイエンス倶楽部
            </span>
          </Box>
        </RouterLink>

        {/* モバイルのみ: テキストを中央に絶対配置 */}
        <Box
          display={{ base: 'block', md: 'none' }}
          position="absolute"
          left="50%"
          style={{ transform: 'translateX(-50%)' }}
          pointerEvents="none"
        >
          <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#2563eb', whiteSpace: 'nowrap' }}>
            データサイエンス倶楽部
          </span>
        </Box>

        {/* デスクトップナビ */}
        <HStack gap={4} align="center" display={{ base: 'none', md: 'flex' }}>
          {NAV_LINKS.map((l) => <NavItem key={l.to} to={l.to} end={l.end}>{l.label}</NavItem>)}
          {adminName ? (
            <>
              <HStack gap={2} align="center">
                <Badge colorPalette="blue" variant="subtle" px={2} py={1} borderRadius="md">管理者</Badge>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700">{adminName}</Text>
              </HStack>
              <NavItem to="/admin">管理</NavItem>
              <Button size="sm" variant="outline" onClick={logout}>ログアウト</Button>
            </>
          ) : (
            <NavItem to="/login">管理者ログイン</NavItem>
          )}
        </HStack>

        {/* ハンバーガーボタン（モバイルのみ） */}
        <Box display={{ base: 'block', md: 'none' }}>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="メニュー"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', fontSize: '1.5rem', lineHeight: 1 }}
          >
            {open ? '✕' : '☰'}
          </button>
        </Box>
      </Flex>

      {/* モバイルメニュー */}
      {open && (
        <Box
          display={{ base: 'block', md: 'none' }}
          bg="white"
          borderTop="1px solid"
          borderColor="gray.100"
          px={4}
          pb={4}
        >
          <VStack align="stretch" gap={0}>
            {NAV_LINKS.map((l) => (
              <MobileNavItem key={l.to} to={l.to} end={l.end} onClick={closeMenu}>
                {l.label}
              </MobileNavItem>
            ))}
            {adminName ? (
              <>
                <MobileNavItem to="/admin" onClick={closeMenu}>管理</MobileNavItem>
                <Box pt={3} borderTop="1px solid" borderColor="gray.100" mt={1}>
                  <HStack gap={2} mb={2}>
                    <Badge colorPalette="blue" variant="subtle" px={2} py={1} borderRadius="md">管理者</Badge>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">{adminName}</Text>
                  </HStack>
                  <Button size="sm" variant="outline" onClick={() => { logout(); closeMenu(); }} w="full">
                    ログアウト
                  </Button>
                </Box>
              </>
            ) : (
              <MobileNavItem to="/login" onClick={closeMenu}>管理者ログイン</MobileNavItem>
            )}
          </VStack>
        </Box>
      )}
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

function MobileNavItem({ to, end, onClick, children }: { to: string; end?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      style={({ isActive }) => ({
        textDecoration: 'none',
        fontWeight: isActive ? '700' : '400',
        color: isActive ? '#2563eb' : '#374151',
        fontSize: '1rem',
        padding: '12px 0',
        borderBottom: '1px solid #f3f4f6',
        display: 'block',
      })}
    >
      {children}
    </NavLink>
  );
}
