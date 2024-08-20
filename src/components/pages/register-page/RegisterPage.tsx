import { FC } from 'react';
import useAuth from 'src/hooks/useAuth';
import { Navigate } from 'react-router-dom';

import FirstRegisterSection from './first-register-section/FirstRegisterSection';

const RegisterPage: FC = () => {
  const { isAuth } = useAuth();
  /* if (isAuth) {
    return <Navigate to="/" replace />;
  } */
  return (
    <main>
      <FirstRegisterSection />
    </main>
  );
};

export default RegisterPage;
