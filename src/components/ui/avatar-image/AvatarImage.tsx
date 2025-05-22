import React, { FC, useState } from 'react';

import styles from './AvatarImage.module.scss';
import UserSvg from 'src/assets/images/icons/24x24-icons/User.svg?react';
import GroupSvg from 'src/assets/images/icons/24x24-icons/Group.svg?react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { IFirebaseRtDbUser } from 'src/interfaces/FirebaseRealtimeDatabase.interface';

interface UserAvatarProps {
  AvatarImg: IFirebaseRtDbUser['avatar'];
  isGroup?: boolean;
  isLittle?: boolean;
  isBig?: boolean;
  animated?: boolean;
}

const AvatarImage: FC<UserAvatarProps> = React.memo(
  ({ AvatarImg, isGroup, isLittle, isBig, animated }) => {
    const [isError, setIsError] = useState(false);
    return (
      <>
        {AvatarImg == null && isError === false && (
          <SkeletonTheme
            borderRadius={999}
            highlightColor="var(--base-white-snow)"
            baseColor="var(--base-grey-gainsboro)"
          >
            <Skeleton
              className={`${styles['avatar-image']} ${styles['avatar-image--svg']} ${isLittle ? styles['avatar-image--little'] : ''} ${isBig ? styles['avatar-image--big'] : ''} ${animated ? styles['avatar-image--animated'] : ''}`}
            />
          </SkeletonTheme>
        )}
        {(AvatarImg?.length === 0 || isError === true) && (
          <div
            className={`${styles['avatar-image']} ${styles['avatar-image--svg']} ${isLittle ? styles['avatar-image--little'] : ''} ${isBig ? styles['avatar-image--big'] : ''} ${animated ? styles['avatar-image--animated'] : ''}`}
            onDragStart={(e: React.DragEvent<HTMLImageElement>) =>
              e.preventDefault()
            }
          >
            {isGroup && (
              <GroupSvg
                className={`${styles['avatar-image__icon']} ${isLittle ? styles['avatar-image__icon--little'] : ''} ${isBig ? styles['avatar-image__icon--big'] : ''}`}
              />
            )}
            {!isGroup && (
              <UserSvg
                className={`${styles['avatar-image__icon']} ${isLittle ? styles['avatar-image__icon--little'] : ''} ${isBig ? styles['avatar-image__icon--big'] : ''}`}
              />
            )}
          </div>
        )}
        {AvatarImg?.length > 0 && isError === false && (
          <img
            src={AvatarImg}
            alt=""
            onError={() => {
              setIsError(true);
            }}
            onDragStart={(e: React.DragEvent<HTMLImageElement>) =>
              e.preventDefault()
            }
            className={`${styles['avatar-image']} ${isLittle ? styles['avatar-image--little'] : ''} ${isBig ? styles['avatar-image--big'] : ''} ${animated ? styles['avatar-image--animated'] : ''}`}
          />
        )}
      </>
    );
  },
);

export default AvatarImage;
