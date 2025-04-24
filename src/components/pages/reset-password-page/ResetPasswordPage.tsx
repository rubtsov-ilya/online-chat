import { FC, useState } from 'react';
import ResetPasswordSection from './reset-password-section/ResetPasswordSection';
import AlertSendedSection from './alert-sended-section/AlertSendedSection';

const ResetPasswordPage: FC = () => {

  const [isMessageSended, setIsMessageSended] = useState<boolean>(false);
  return (
    <main>
      {!isMessageSended && (
        <ResetPasswordSection setIsMessageSended={setIsMessageSended} />
      )}
      {isMessageSended && <AlertSendedSection />}
    </main>
  );
};

export default ResetPasswordPage;
