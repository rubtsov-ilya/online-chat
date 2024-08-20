import { FC } from 'react';
import useAuth from 'src/hooks/useAuth';

import FirstLoginSection from './first-login-section/FirstLoginSection';

const LoginPage: FC = () => {
  const { isAuth } = useAuth();
  /* if (isAuth) {
    return <Navigate to="/" replace />;
  } */

  return (
    <main>
      <FirstLoginSection />
    </main>
  );
};

export default LoginPage;
