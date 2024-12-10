import { FC } from 'react';

import styles from './AvatarImage.module.scss';
import UserSvg from 'src/assets/images/icons/24x24-icons/User.svg?react';

interface UserAvatarProps {
  AvatarImg: string;
  isLittle?: boolean;
}

const AvatarImage: FC<UserAvatarProps> = ({ AvatarImg, isLittle }) => {
  return (
    <>
      {AvatarImg === 'default' && (
        <div className={`${styles['avatar-image']} ${styles['avatar-image--svg']} ${isLittle ? styles['avatar-image--little'] : ''}`}>
          <UserSvg className={`${styles['avatar-image__icon']} ${isLittle ? styles['avatar-image__icon--little'] : ''}`} />
        </div>
      )}
      {AvatarImg !== 'default' && (
        <img
          src={AvatarImg}
          alt=""
          onError={undefined}
          className={`${styles['avatar-image']} ${isLittle ? styles['avatar-image--little'] : ''}`}
        />
      )}
    </>
  );
};

export default AvatarImage;
