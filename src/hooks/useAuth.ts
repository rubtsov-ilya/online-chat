import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/UserSlice";

const useAuth = () => {
  const {email, token, uid, uMockid} = useSelector(selectUser);

  return {
    isAuth: !!email,
    email,
    token,
    uid,
    uMockid
  }
}

export default useAuth