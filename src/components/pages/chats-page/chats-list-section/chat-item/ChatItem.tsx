import { FC, useEffect, useRef, useState } from 'react';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';
import UserBanSvg from 'src/assets/images/icons/24x24-icons/User Ban.svg?react';
import DeleteSvg from 'src/assets/images/icons/24x24-icons/Delete.svg?react';

import styles from './ChatItem.module.scss';
import CheckedAndTimeStatuses from 'src/components/ui/checked-and-time-statuses/CheckedAndTimeStatuses';
import useToggleModal from 'src/hooks/useToggleModal';
import ModalBackdrop from 'src/components/ui/modal-backdrop/ModalBackdrop';
import ModalActionConfirm from 'src/components/ui/modal-action-confirm/modalActionConfirm';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { IChatWithDetails } from 'src/interfaces/ChatsWithDetails.interface';
import { useDispatch } from 'react-redux';
import {
  setActiveChat,
  setActiveChatnameAndAvatar,
} from 'src/redux/slices/ActiveChatSlice';
import { useNavigate } from 'react-router-dom';
import useActiveChat from 'src/hooks/useActiveChat';

interface ChatItemProps {
  isMobileScreen: boolean;
  chatsListRef: React.RefObject<HTMLDivElement | null>;
  chatItemData: IChatWithDetails;
  chatAvatar: string;
  chatname: string;
  uncheckedCount: number,
  uid: string;
}

const ChatItem: FC<ChatItemProps> = ({
  isMobileScreen,
  chatsListRef,
  chatItemData,
  chatAvatar,
  chatname,
  uncheckedCount,
  uid,
}) => {
  const [modalOpen, setModalOpen] = useState<'ban' | 'delete' | false>(false);
  const { toggleModal } = useToggleModal({ setCbState: setModalOpen });
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isHover, setIsHover] = useState<boolean>(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatItemRef = useRef<HTMLDivElement>(null);
  const initialTouchYRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const longPressDuration = 500;
  const { activeChatAvatar, activeChatname, activeChatId } = useActiveChat();

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
    if (chatItemData.chatId === activeChatId) {
      const updates: Partial<{
        activeChatAvatar: string;
        activeChatname: string;
      }> = {};

      if (chatAvatar !== activeChatAvatar) {
        updates.activeChatAvatar = chatAvatar;
      }
      if (chatname !== activeChatname) {
        updates.activeChatname = chatname;
      }

      if (Object.keys(updates).length > 0) {
        dispatch(setActiveChatnameAndAvatar(updates));
      }
    }
  }, [chatAvatar, chatname]);

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

  const onChatItemForegroundClick = () => {
    setIsActive(false);
    const chatBlocked =
      chatItemData.isGroup === false
        ? chatItemData.membersDetails.find((member) => {
            return member.uid !== uid;
          })?.blocked || []
        : [];
    if (activeChatId !== chatItemData.chatId) {
      dispatch(
        setActiveChat({
          activeChatId: chatItemData.chatId,
          activeChatname: chatname,
          activeChatAvatar: chatAvatar,
          activeChatBlocked: chatBlocked,
          activeChatIsGroup: chatItemData.isGroup,
          activeChatMembers: chatItemData.membersDetails,
        }),
      );
    }
    navigate('/chats/chat');
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
          onClick={onChatItemForegroundClick}
          onTouchMove={onTouchMove}
          className={`${styles['chat-item__foreground']} ${isActive ? styles['chat-item__foreground--active'] : ''} ${isHover && isMobileScreen ? styles['chat-item__foreground--hover'] : ''}`}
        >
          <div className={styles['chat-item__left-wrapper']}>
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
                  {chatname !== null && chatname.length > 0 && chatname}
                  {chatname !== null && chatname.length === 0 && <Skeleton />}
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
                  {chatname !== null &&
                    chatname.length > 0 &&
                    chatItemData.lastMessageText.length !== 0 &&
                    chatItemData.lastMessageText}
                  {chatname !== null &&
                    chatname.length > 0 &&
                    chatItemData.lastMessageText.length === 0 &&
                    'Контент'}
                  {chatname !== null && chatname.length === 0 && <Skeleton />}
                </SkeletonTheme>
              </span>
            </div>
          </div>
          <div className={styles['chat-item__right-wrapper']}>
            {uncheckedCount > 0 && (
              <div className={styles['chat-item__counter-wrapper']}>
                <span className={styles['chat-item__counter']}>
                  {uncheckedCount}
                </span>
              </div>
            )}
            <CheckedAndTimeStatuses
              isChecked={chatItemData.lastMessageIsChecked}
              time={chatItemData.lastMessageDateUTC}
              isOwn={chatItemData.lastMessageSenderUid === uid}
              /* далее указаны настройки отображения */
              isLoading={false}
              isCanceled={false}
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
            avatar={chatAvatar}
          />
        </ModalBackdrop>
      )}
    </>
  );
};

export default ChatItem;
