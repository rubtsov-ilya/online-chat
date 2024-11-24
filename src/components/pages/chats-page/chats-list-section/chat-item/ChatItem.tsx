import { FC, useEffect, useRef, useState } from 'react';
import userAvatarImg from 'src/assets/images/icons/dev-icons/avatar.jpg';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';
import UserBanSvg from 'src/assets/images/icons/24x24-icons/User Ban.svg?react';
import DeleteSvg from 'src/assets/images/icons/24x24-icons/Delete.svg?react';

import styles from './ChatItem.module.scss';
import CheckedAndTimeStatuses from 'src/components/ui/checked-and-time-statuses/CheckedAndTimeStatuses';
import useToggleModal from 'src/hooks/useToggleModal';
import ModalBackdrop from 'src/components/ui/modal-backdrop/ModalBackdrop';
import ModalActionConfirm from 'src/components/ui/modal-action-confirm/modalActionConfirm';

interface ChatItemProps {
  isMobileScreen: boolean;
  chatsListRef: React.RefObject<HTMLDivElement>;
}

const ChatItem: FC<ChatItemProps> = ({ isMobileScreen, chatsListRef }) => {
  const [modalOpen, setModalOpen] = useState<'ban' | 'delete' | false>(false);
  const { toggleModal } = useToggleModal({ setCbState: setModalOpen });
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

  const modalActionData = {
    delete: {
      title: 'Удалить чат',
      subtitle: 'Вы точно хотите удалить чат без возможности восстановления?',
      actionBtnText: 'Удалить',
      action() {
        console.log('delete');
      },
    },
    ban: {
      title: 'Подтверждение',
      subtitle: 'Запретить пользователю писать Вам сообщения?',
      actionBtnText: 'Заблокировать',
      action() {
        console.log('ban');
      },
    },
  };

  useEffect(() => {
    const onScroll = (event: Event) => {
      if (event.cancelable) {
        event.preventDefault();
      }
    };

    const chatItemCurrent = chatItemRef?.current;
    const chatsListCurrent = chatsListRef?.current;

    if (isActive && chatItemCurrent) {
      if (isMobileScreen && chatsListCurrent) {
        chatsListCurrent.style.overflow = 'hidden';
      } else {
        chatItemCurrent.addEventListener('wheel', onScroll, {
          passive: false,
        });
        chatItemCurrent.addEventListener('touchmove', onScroll, {
          passive: false,
        });
      }
    }
    if (!isActive && chatItemCurrent) {
      if (isMobileScreen && chatsListCurrent) {
        chatsListCurrent.style.overflow = '';
      } else {
        chatItemCurrent.removeEventListener('wheel', onScroll);
        chatItemCurrent.removeEventListener('touchmove', onScroll);
      }
    }
    return () => {
      if (chatItemCurrent) {
        if (isMobileScreen && chatsListCurrent) {
          chatsListCurrent.style.overflow = '';
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
        <div
          className={styles['chat-item__background']}
          onContextMenu={(e) => {
            if (isMobileScreen) {
              e.preventDefault();
            }
          }}
        >
          <button
            onClick={() => toggleModal('ban')}
            onContextMenu={(e) => {
              if (isMobileScreen) {
                e.preventDefault();
              }
            }}
            className={styles['chat-item__background-btn']}
          >
            <UserBanSvg className={styles['chat-item__user-ban-icon']} />
          </button>
          <button
            onClick={() => toggleModal('delete')}
            onContextMenu={(e) => {
              if (isMobileScreen) {
                e.preventDefault();
              }
            }}
            className={styles['chat-item__background-btn']}
          >
            <DeleteSvg className={styles['chat-item__delete-icon']} />
          </button>
        </div>
        <div
          onContextMenu={(e) => {
            if (isMobileScreen) {
              e.preventDefault();
            }
          }}
          onTouchStart={(e: React.TouchEvent) => {
            if (isMobileScreen && !isActive) {
              if (!isHover) {
                setIsHover(true);
              }
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
            /* вынести в отдельную функцию и там выключать стейт при экешене нужном*/
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
            if (isMobileScreen) {
              if (isHover) {
                setIsHover(false);
              }
            }
            setIsActive((prev) => !prev);
          }}
          onClick={() => {
            if (isMobileScreen) {
              if (isHover) {
                setIsHover(false);
              }
            }
            setIsActive((prev) => !prev);
          }}
          className={styles['chat-item__overlay']}
        />
      )}
      {modalOpen && (
        /* аргумент number в toggleModal - длительность transition opacity в modal-backdrop */
        <ModalBackdrop
          toggleModal={() => toggleModal(false, 100)}
          divIdFromIndexHtml={'modal-backdrop'}
        >
          <ModalActionConfirm
            isMobileScreen={isMobileScreen}
            title={modalActionData[modalOpen].title}
            subtitle={modalActionData[modalOpen].subtitle}
            actionBtnText={modalActionData[modalOpen].actionBtnText}
            action={modalActionData[modalOpen].action}
            avatar={userAvatarImg}
          />
        </ModalBackdrop>
      )}
    </>
  );
};

export default ChatItem;
