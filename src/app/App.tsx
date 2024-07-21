/// <reference types='vite-plugin-svgr/client' />
import { Routes, Route, Navigate } from "react-router-dom";
import BodyLockProvider from "../providers/BodyLockProvider.tsx";
import ScrollToTopProvider from "../providers/ScrollToTopProvider.tsx";
import DarkThemeProvider from "../providers/DarkThemeProvider.tsx";
import AuthProvider from "../providers/AuthProvider.tsx";
import HomePage from "../components/pages/home-page/HomePage.tsx";
import LoginPage from "../components/pages/login-page/LoginPage.tsx";
import RegisterPage from "../components/pages/register-page/RegisterPage.tsx";
import ResetPasswordPage from "../components/pages/reset-password-page/ResetPasswordPage.tsx";


export default function App() {
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
              {/* <Route path="chats" element={<ResetPasswordPage />}>
                <Route path="chat" element={<RegisterPage />} />
              </Route> */}
              <Route path="*" element={<Navigate to="/" replace/>} />
            </Route>
          </Routes>
      </DarkThemeProvider>
    </BodyLockProvider>
  );
}
