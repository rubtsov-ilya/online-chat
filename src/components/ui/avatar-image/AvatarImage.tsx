import { FC } from 'react';

import styles from './AvatarImage.module.scss';

interface UserAvatarProps {
  AvatarImg: string;
  isLittle?: boolean;
}

const AvatarImage: FC<UserAvatarProps> = ({ AvatarImg, isLittle }) => {
  return (
    <img
      src={AvatarImg}
      alt=""
      onError={undefined}
      className={`${styles['avatar-image']} ${isLittle ? styles['avatar-image--little'] : ''}`}
    />
  );
};

export default AvatarImage;
