import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FC, useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import { firebaseApp } from "../firebase";
import { setUser } from "../redux/slices/UserSlice";
import { useGetUsersQuery } from "../redux";
import useAuth from "../hooks/useAuth";

const AuthProvider: FC = ({ }) => {
  const {uMockid} = useAuth()
  const { data: users = [] } = useGetUsersQuery(undefined, { skip: uMockid !== null });
  const dispatch = useDispatch()


  useLayoutEffect(() => {
    if (users.length > 0) {
      const auth = getAuth(firebaseApp);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          user.getIdToken().then((token) => {
            dispatch(
              setUser({
                email: user.email,
                uid: user.uid,
                token: token,
                uMockid: users.find(u => u.uid === user.uid)?.mockid || null
              })
            );
          });
        } else {
          // User is signed out
          console.log("User is signed out");
        }
      });
    }
  }, [users])


  return null
}

export default AuthProvider