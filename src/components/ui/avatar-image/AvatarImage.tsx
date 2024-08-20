import { FC } from 'react';

import styles from './AvatarImage.module.scss';

interface UserAvatarProps {
  userAvatarImg: string;
}

const AvatarImage: FC<UserAvatarProps> = ({ userAvatarImg }) => {
  return (
    <img src={userAvatarImg} alt="Avatar" className={styles['avatar-image']} />
  );
};

export default AvatarImage;
