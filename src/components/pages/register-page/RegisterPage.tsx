import { FC } from "react"
import FirstRegisterSection from "./first-register-section/FirstRegisterSection"
import useAuth from "../../../hooks/useAuth";
import { Navigate } from "react-router-dom";

const RegisterPage: FC = () => {
  const {isAuth} = useAuth()
  /* if (isAuth) {
    return <Navigate to="/" replace />;
  } */
  return (
    <main>
      <FirstRegisterSection />
    </main>
  )
}

export default RegisterPage
