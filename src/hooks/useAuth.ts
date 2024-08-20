import { useSelector } from 'react-redux';
import { selectUser } from 'src/redux/slices/UserSlice';

const useAuth = () => {
  const { email, token, uid, uMockid } = useSelector(selectUser);

  return {
    isAuth: !!email,
    email,
    token,
    uid,
    uMockid,
  };
};

export default useAuth;
