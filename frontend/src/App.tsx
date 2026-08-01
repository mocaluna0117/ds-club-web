import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Box, Flex } from '@chakra-ui/react';
import { apolloClient } from './lib/apolloClient';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MembersPage } from './pages/MembersPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';
import { ActivityPage } from './pages/ActivityPage';
// エディタ (TipTap) は重いので一度 React.lazy で別チャンクに分離したが、分離すると実行時に
// "Cannot read properties of null (reading 'cached')" で画面が白くなるため静的インポートに戻した。
// 分割を再挑戦する場合は、必ず実機でエディタが描画されることを確認すること。
import { PostEditorPage } from './pages/PostEditorPage';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Flex minH="100vh" flexDir="column">
            <Navbar />
            <Box flex={1} pt="76px">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/activities" element={<ActivityPage />} />
                <Route path="/blog/:id" element={<BlogPostPage />} />
                <Route path="/activities/:id" element={<BlogPostPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/new-post" element={<PostEditorPage />} />
                <Route path="/admin/edit-post/:id" element={<PostEditorPage />} />
              </Routes>
            </Box>
            <Footer />
          </Flex>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
