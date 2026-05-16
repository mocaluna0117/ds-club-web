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
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';
import { ActivityPage } from './pages/ActivityPage';
import { PostEditorPage } from './pages/PostEditorPage';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <BrowserRouter basename="/ds-club-web">
          <Flex minH="100vh" flexDir="column">
            <Navbar />
            <Box flex={1}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/activities" element={<ActivityPage />} />
                <Route path="/blog/:id" element={<BlogPostPage />} />
                <Route path="/activities/:id" element={<BlogPostPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/new-post" element={<PostEditorPage />} />
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
