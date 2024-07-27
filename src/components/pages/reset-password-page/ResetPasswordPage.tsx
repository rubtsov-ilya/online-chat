import { FC, useState } from "react"
import { Navigate } from "react-router-dom"
import useAuth from "src/hooks/useAuth"
import ResetPasswordSection from "./reset-password-section/ResetPasswordSection"
import AlertSendedSection from "./alert-sended-section/AlertSendedSection"


const ResetPasswordPage: FC = () => {
  const {isAuth} = useAuth()
 /*  if (isAuth) {
    return <Navigate to="/" replace />;
  } */
  const [isMessageSended, setIsMessageSended] = useState<boolean>(false)
  return (
    <main>
      {!isMessageSended && <ResetPasswordSection setIsMessageSended={setIsMessageSended} />}
      {isMessageSended && <AlertSendedSection />}
    </main>
  )
}

export default ResetPasswordPage
