import { FC, useEffect, useRef, useState } from 'react';
import styles from './MessageStickyDate.module.scss';
import { IMessage } from 'src/interfaces/Message.interface';
import { ILoadingMessage } from 'src/interfaces/LoadingMessage.interface';

interface MessageStickyDateProps {
  messageData: IMessage | ILoadingMessage;
  chatMessagesRef: React.RefObject<HTMLDivElement>;
}

const MessageStickyDate: FC<MessageStickyDateProps> = ({
  messageData,
  chatMessagesRef,
}) => {
  const stickyDateRef = useRef<HTMLDivElement>(null);
  const relativeDivRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isInViewport, setIsInViewport] = useState<boolean>(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;
    const chatMessagesCurrent = chatMessagesRef.current;

    const onScroll = () => {
      if (stickyDateRef.current) {
        // Показать дату при прокрутке
        setIsActive(true);

        // Очистить предыдущий таймаут, если он существует
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        // Установить таймаут для скрытия даты при остановке скролла
        scrollTimeout = setTimeout(() => {
          setIsActive(false);
        }, 1000);
      }
    };

    if (chatMessagesCurrent) {
      chatMessagesCurrent.addEventListener('scroll', onScroll);
    }

    return () => {
      if (chatMessagesCurrent) {
        chatMessagesCurrent.removeEventListener('scroll', onScroll);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [chatMessagesRef]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 1.0 },
    );

    if (relativeDivRef.current) {
      observer.observe(relativeDivRef.current);
    }

    return () => {
      if (relativeDivRef.current) {
        observer.unobserve(relativeDivRef.current);
      }
    };
  }, []);

  const currentDate = new Date(messageData.messageDateUTC).toLocaleDateString(
    'ru-RU',
    {
      day: 'numeric',
      month: 'long',
    },
  );

  return (
    <>
      <div
        className={`${styles['sticky-date']} ${isActive || isInViewport ? styles['active'] : ''}`}
        ref={stickyDateRef}
      >
        <span className={styles['sticky-date__span']}>{currentDate}</span>
      </div>
      <div ref={relativeDivRef}></div>
    </>
  );
};

export default MessageStickyDate;
