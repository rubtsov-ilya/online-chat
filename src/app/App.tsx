/// <reference types='vite-plugin-svgr/client' />
import { Routes, Route, Navigate } from 'react-router-dom';
import BodyLockProvider from 'src/providers/BodyLockProvider.tsx';
import ScrollToTopProvider from 'src/providers/ScrollToTopProvider.tsx';
import DarkThemeProvider from 'src/providers/DarkThemeProvider.tsx';
import AuthProvider from 'src/providers/AuthProvider.tsx';
import HomePage from 'src/components/pages/home-page/HomePage.tsx';
import LoginPage from 'src/components/pages/login-page/LoginPage.tsx';
import RegisterPage from 'src/components/pages/register-page/RegisterPage.tsx';
import ResetPasswordPage from 'src/components/pages/reset-password-page/ResetPasswordPage.tsx';
import ChatsPage from 'src/components/pages/chats-page/ChatsPage';
import ChatPage from 'src/components/pages/chat-page/ChatPage';
import useMobileScreen from 'src/hooks/useMobileScreen';
import useAuth from 'src/hooks/useAuth';

export default function App() {
  const { isAuth } = useAuth();
  const { isMobileScreen } = useMobileScreen();

  return (
    <BodyLockProvider>
      <DarkThemeProvider>
        <ScrollToTopProvider />
        <AuthProvider />
        <Routes>
          {/* <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="cart" element={<ProductsCartPage />} />
              <Route path="*" element={<NotfoundPage />} />
              <Route path="*" element={<Navigate to="/" replace/>} />
            </Route> */}
          <Route path="/">
            <Route index element={isAuth ? <Navigate to="/chats" replace/> : <Navigate to="/login" replace/>} />
            <Route path="login" element={isAuth ? <Navigate to="/chats" replace/> : <LoginPage />} />
            <Route path="register" element={isAuth ? <Navigate to="/chats" replace/> : <RegisterPage />} />
            <Route path="reset-password" element={isAuth ? <Navigate to="/chats" replace/> : <ResetPasswordPage />} />
            <Route
              path="chats"
              element={isAuth ? <ChatsPage isMobileScreen={isMobileScreen} /> : <Navigate to="/login" replace/>}
            >
              {!isMobileScreen && <Route path="chat" element={isAuth ? <ChatPage /> : <Navigate to="/login" replace/>} />}
            </Route>
            {isMobileScreen && (
              <Route path="chats/chat" element={isAuth ? <ChatPage /> : <Navigate to="/login" replace/>} />
            )}
            <Route path="*" element={isAuth ? <Navigate to="/chats" replace/> : <Navigate to="/login" replace/>} />
          </Route>
        </Routes>
      </DarkThemeProvider>
    </BodyLockProvider>
  );
}
