import { FC } from 'react';

import styles from './AvatarImage.module.scss';
import UserSvg from 'src/assets/images/icons/24x24-icons/User.svg?react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface UserAvatarProps {
  AvatarImg: string;
  isLittle?: boolean;
}

const AvatarImage: FC<UserAvatarProps> = ({ AvatarImg, isLittle }) => {
  return (
    <>
      {AvatarImg.length === 0 && (
        <SkeletonTheme
          width={'40%'}
          borderRadius={999}
          height={40}
          highlightColor="var(--base-white-snow)"
          baseColor='var(--base-grey-gainsboro)'
        >
          <Skeleton
            className={`${styles['avatar-image']} ${styles['avatar-image--svg']} ${isLittle ? styles['avatar-image--little'] : ''}`}
          />
        </SkeletonTheme>
      )}
      {AvatarImg === 'default' && (
        <div
          className={`${styles['avatar-image']} ${styles['avatar-image--svg']} ${isLittle ? styles['avatar-image--little'] : ''}`}
        >
          <UserSvg
            className={`${styles['avatar-image__icon']} ${isLittle ? styles['avatar-image__icon--little'] : ''}`}
          />
        </div>
      )}
      {AvatarImg !== 'default' && AvatarImg.length > 0 && (
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
