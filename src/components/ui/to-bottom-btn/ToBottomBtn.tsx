import { createPortal } from 'react-dom';
import { FC, useEffect, useState } from 'react';
import styles from './ToBottomBtn.module.scss';
import ArrowSvg from 'src/assets/images/icons/24x24-icons/Arrow Right.svg?react';

interface ToBottomBtnProps {
  endRef: React.RefObject<HTMLDivElement>;
  chatMessagesRef: React.RefObject<HTMLDivElement>;
}

const ToBottomBtn: FC<ToBottomBtnProps> = ({ endRef, chatMessagesRef }) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const chatMessagesCurrent = chatMessagesRef.current;
    let prevScrollPosition = 0;

    const onScroll = () => {
      if (chatMessagesCurrent) {
        const { scrollTop, clientHeight, scrollHeight } = chatMessagesCurrent;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight;
        /* когда полностью прокручена до низа секция, то isAtBottom == true */
        const isScrollingDown =
          prevScrollPosition !== 0 && prevScrollPosition < scrollTop;
        prevScrollPosition = scrollTop;
        if (isScrollingDown && !isAtBottom) {
          /* если скроллится вниз и не в самом низу, то сделать активным */
          setIsActive(true);
        } else {
          setIsActive(false);
        }
      }
    };

    if (chatMessagesCurrent) {
      chatMessagesCurrent.addEventListener('scroll', onScroll);
    }

    return () => {
      if (chatMessagesCurrent) {
        chatMessagesCurrent.removeEventListener('scroll', onScroll);
      }
    };
  }, []);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return createPortal(
    <button
      className={`${styles['to-bottom-button']} ${isActive ? styles['active'] : ''}`}
      onClick={scrollToBottom}
    >
      <ArrowSvg className={styles['to-bottom-button__arrow-icon']} />
    </button>,
    document.getElementById('to-bottom-btn-wrapper') as HTMLDivElement,
  );
};

export default ToBottomBtn;
