import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Box, Center, Flex, Spinner } from '@chakra-ui/react';
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

// 管理者専用のリッチテキストエディタ (TipTap) は重いため、メインバンドルから分離して
// エディタページを開いたときだけ読み込む。
// 再デプロイ後は古いタブが持つチャンクURLが404になるため、その場合は一度だけリロードして復旧する
const PostEditorPage = lazy(() =>
  import('./pages/PostEditorPage')
    .then((m) => {
      sessionStorage.removeItem('editor-chunk-reloaded');
      return { default: m.PostEditorPage };
    })
    .catch((e) => {
      if (!sessionStorage.getItem('editor-chunk-reloaded')) {
        sessionStorage.setItem('editor-chunk-reloaded', '1');
        window.location.reload();
        return new Promise<{ default: typeof import('./pages/PostEditorPage').PostEditorPage }>(() => {});
      }
      throw e;
    }),
);

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Flex minH="100vh" flexDir="column">
            <Navbar />
            <Box flex={1} pt="76px">
              {/* エディタチャンクの取得は GitHub Pages からで API とは無関係。
                  「サーバーを起動しています」は出さず素のスピナーにする */}
              <Suspense fallback={<Center py={20}><Spinner size="xl" color="blue.500" /></Center>}>
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
              </Suspense>
            </Box>
            <Footer />
          </Flex>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
