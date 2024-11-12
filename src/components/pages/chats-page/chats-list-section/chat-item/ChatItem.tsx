import { FC, useEffect, useRef, useState } from 'react';
import userAvatarImg from 'src/assets/images/icons/dev-icons/avatar.jpg';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';
import UserBanSvg from 'src/assets/images/icons/24x24-icons/User Ban.svg?react';
import DeleteSvg from 'src/assets/images/icons/24x24-icons/Delete.svg?react';

import styles from './ChatItem.module.scss';
import CheckedAndTimeStatuses from 'src/components/ui/checked-and-time-statuses/CheckedAndTimeStatuses';

interface ChatItemProps {
  isMobileScreen: boolean;
}

const ChatItem: FC<ChatItemProps> = ({ isMobileScreen }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isHover, setIsHover] = useState<boolean>(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatItemRef = useRef<HTMLDivElement>(null);
  const initialTouchYRef = useRef<number | null>(null);
  const longPressDuration = 500;

  const userData = {
    lastMessage: 'The weather will be perfect for the stuses isisisisisi sas a',
    messageDateUTC: '2024-10-23T07:16:04.275Z',
    counter: 14,
    userName: 'Антон Арбузов',
  };

  useEffect(() => {
    const onScroll = (event: Event) => {
      if (event.cancelable) {
        event.preventDefault();
      }
    };

    const chatItemCurrent = chatItemRef?.current;

    if (isActive && chatItemCurrent) {
      if (isMobileScreen) {
        window.addEventListener('wheel', onScroll, {
          passive: false,
        });
        window.addEventListener('touchmove', onScroll, {
          passive: false,
        });
      } else {
        chatItemCurrent.addEventListener('wheel', onScroll, {
          passive: false,
        });
        chatItemCurrent.addEventListener('touchmove', onScroll, {
          passive: false,
        });
      }
    } else if (!isActive && chatItemCurrent) {
      chatItemCurrent.removeEventListener('wheel', onScroll);
      chatItemCurrent.removeEventListener('touchmove', onScroll);
    }
    return () => {
      if (chatItemCurrent) {
        if (isMobileScreen) {
          window.removeEventListener('wheel', onScroll);
          window.removeEventListener('touchmove', onScroll);
        } else {
          chatItemCurrent.removeEventListener('wheel', onScroll);
          chatItemCurrent.removeEventListener('touchmove', onScroll);
        }
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (isMobileScreen && isActive) {
      if (longPressTimerRef.current) {
        longPressTimerRef.current = null;
      }
    }

    return () => {
      if (isMobileScreen && isActive) {
        if (longPressTimerRef.current) {
          longPressTimerRef.current = null;
        }
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (!isHover) return;

    const timer = setTimeout(() => {
      console.log('first');
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
        className={`${styles['chat-item']} ${isActive ? styles['chat-item--active'] : ''}`}
        onContextMenu={(e) => {
          if (!isMobileScreen) {
            e.preventDefault();
            setIsActive((prev) => !prev);
          }
        }}
        ref={chatItemRef}
      >
        <div className={styles['chat-item__background']}>
          <button className={styles['chat-item__background-btn']}>
            <UserBanSvg className={styles['chat-item__user-ban-icon']} />
          </button>
          <button className={styles['chat-item__background-btn']}>
            <DeleteSvg className={styles['chat-item__delete-icon']} />
          </button>
        </div>
        <div
          onContextMenu={(e) => {
            if (isMobileScreen) {
              e.preventDefault();
              setIsHover(true);
            }
          }}
          onTouchStart={(e: React.TouchEvent) => {
            if (isMobileScreen) {
              setIsHover(true);
              initialTouchYRef.current = e.touches[0].clientY;
              longPressTimerRef.current = setTimeout(() => {
                setIsActive(true);
              }, longPressDuration);
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
            if (isActive && longPressTimerRef.current !== null) {
              setIsActive(false);
            }
            /* вынести в отдельную функцию и там выключать стейт */
          }}
          onTouchMove={onTouchMove}
          className={`${styles['chat-item__foreground']} ${isActive ? styles['chat-item__foreground--active'] : ''} ${isHover && isMobileScreen ? styles['chat-item__foreground--hover'] : ''}`}
        >
          <div className={styles['chat-item__left-wrapper']}>
            <AvatarImage AvatarImg={userAvatarImg} />
            <div className={styles['chat-item__user-details-wrapper']}>
              <span className={styles['chat-item__user-name']}>
                {userData.userName}
              </span>
              <span className={styles['chat-item__user-message']}>
                {userData.lastMessage.length > 38
                  ? userData.lastMessage.slice(0, 38) + '...'
                  : userData.lastMessage}
              </span>
            </div>
          </div>
          <div className={styles['chat-item__right-wrapper']}>
            <div className={styles['chat-item__counter-wrapper']}>
              <span className={styles['chat-item__counter']}>
                {userData.counter}
              </span>
            </div>
            <CheckedAndTimeStatuses
              isChecked={true}
              time={userData.messageDateUTC}
              isLoading={false}
              isCanceled={false}
              isOwn={true}
            />
          </div>
        </div>
      </div>
      {isActive && (
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            setIsActive((prev) => !prev);
          }}
          onClick={() => setIsActive((prev) => !prev)}
          className={styles['chat-item__overlay']}
        />
      )}
    </>
  );
};

export default ChatItem;
