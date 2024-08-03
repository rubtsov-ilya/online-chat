/// <reference types='vite-plugin-svgr/client' />
import { Routes, Route, Navigate } from "react-router-dom";
import BodyLockProvider from "src/providers/BodyLockProvider.tsx";
import ScrollToTopProvider from "src/providers/ScrollToTopProvider.tsx";
import DarkThemeProvider from "src/providers/DarkThemeProvider.tsx";
import AuthProvider from "src/providers/AuthProvider.tsx";
import HomePage from "src/components/pages/home-page/HomePage.tsx";
import LoginPage from "src/components/pages/login-page/LoginPage.tsx";
import RegisterPage from "src/components/pages/register-page/RegisterPage.tsx";
import ResetPasswordPage from "src/components/pages/reset-password-page/ResetPasswordPage.tsx";
import ChatsPage from "src/components/pages/chats-page/ChatsPage";
import ChatPage from "src/components/pages/chat-page/ChatPage";
import { useMediaQuery } from "react-responsive";


export default function App() {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 991px)'})
  console.log(isMobileScreen)

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
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              <Route path="chats" element={<ChatsPage />} >
                {!isMobileScreen && <Route path="chat" element={<ChatPage />} />}
              </Route>
              {isMobileScreen && <Route path="chats/chat" element={<ChatPage />} />}
              {/* <Route path="*" element={<Navigate to="/" replace/>} /> */}
            </Route>
          </Routes>
      </DarkThemeProvider>
    </BodyLockProvider>
  );
}
