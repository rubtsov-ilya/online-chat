import { FC, useEffect, useRef, useState } from 'react';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';

import styles from './ChatGlobalItem.module.scss';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface ChatItemProps {
  isMobileScreen: boolean;
  chatAvatar: string;
  chatName: string;
}

const ChatGlobalItem: FC<ChatItemProps> = ({
  isMobileScreen,
  chatAvatar,
  chatName,
}) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatItemRef = useRef<HTMLDivElement>(null);
  const initialTouchYRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isHover) return;

    const timer = setTimeout(() => {
      setIsHover(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [isHover]);

  const onTouchMove = (e: React.TouchEvent) => {
    if (initialTouchYRef.current !== null) {
      const currentY = e.touches[0].clientY;
      const movementThreshold = 0; // Минимальное перемещение для отмены долгого нажатия

      if (Math.abs(currentY - initialTouchYRef.current) > movementThreshold) {
        // Если палец сдвинулся на достаточное расстояние, отменяем таймер
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
        initialTouchYRef.current = null; // Сбрасываем начальное положение касания
      }
    }
  };

  return (
    <>
          <div
            onContextMenu={(e) => {
              if (isMobileScreen) {
                e.preventDefault();
              }
            }}
            onTouchStart={(e: React.TouchEvent) => {
              if (isMobileScreen) {
                if (!isHover) {
                  setIsHover(true);
                }
              }
            }}
            onTouchEnd={() => {
              if (isMobileScreen) {
                if (longPressTimerRef.current) {
                  clearTimeout(longPressTimerRef.current);
                  longPressTimerRef.current = null;
                }
                initialTouchYRef.current = null;
              }
            }}
            onClick={() => {
              /* вынести в отдельную функцию и там выключать стейт при экешене нужном*/
            }}
            onTouchMove={onTouchMove}
            className={`${styles['chat-item']} ${isHover && isMobileScreen ? styles['chat-item--hover'] : ''}`}
          >
            <div className={styles['chat-item__wrapper']}>
              <AvatarImage AvatarImg={chatAvatar} />

              <div className={styles['chat-item__user-details-wrapper']}>
                <SkeletonTheme
                  width={'40%'}
                  borderRadius={2}
                  height={17}
                  highlightColor="var(--base-white-snow)"
                  baseColor="var(--base-grey-gainsboro)"
                >
                  <span className={styles['chat-item__user-name']}>
                    {chatName !== null && chatName.length > 0 && chatName}
                    {chatName !== null && chatName.length === 0 && <Skeleton />}
                  </span>
                </SkeletonTheme>
                <span className={styles['chat-item__user-message']}>
                  <SkeletonTheme
                    width={'100%'}
                    borderRadius={2}
                    height={14}
                    highlightColor="var(--base-white-snow)"
                    baseColor="var(--base-grey-gainsboro)"
                  >
                    {chatName == null &&
                      <Skeleton />}
                    {chatName !== null && chatName.length === 0 &&
                      'Неизвестный пользователь'}
                    {chatName !== null && chatName.length > 0 && 'Новый чат'}
                  </SkeletonTheme>
                </span>
              </div>
            </div>
          </div>
    </>
  );
};

export default ChatGlobalItem;
