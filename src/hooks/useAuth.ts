import { useSelector } from 'react-redux';
import { selectUser } from 'src/redux/slices/UserSlice';

const useAuth = () => {
  const { email, avatar, uid, username, blocked } = useSelector(selectUser);
  /* get in components - const { isAuth, email, avatar, uid, username } = useAuth(); */

  return {
    isAuth: !!email,
    email,
    avatar,
    uid,
    username,
    blocked,
  };
};

export default useAuth;
