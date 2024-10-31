import { FC, useEffect, useState } from 'react';
import styles from './ToBottomBtn.module.scss';
import ArrowSvg from 'src/assets/images/icons/24x24-icons/Arrow Right.svg?react';

interface ToBottomBtnProps {
  chatMessagesRef: React.RefObject<HTMLDivElement>;
  scrollToBottom: () => void;
}

const ToBottomBtn: FC<ToBottomBtnProps> = ({
  chatMessagesRef,
  scrollToBottom,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const chatMessagesCurrent = chatMessagesRef.current;
    let prevScrollPosition = 0;

    const onScroll = () => {
      if (chatMessagesCurrent) {
        const { scrollTop, clientHeight, scrollHeight } = chatMessagesCurrent;
        const deadZone = 200;
        /* deadZone - желаемое количество пикселей от самого низа секции в диапозоне которого не будет появляться кнопка прокрутки */
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - deadZone;
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

  return (
    <button
      className={`${styles['to-bottom-button']} ${isActive ? styles['active'] : ''}`}
      onClick={scrollToBottom}
    >
      <ArrowSvg className={styles['to-bottom-button__arrow-icon']} />
    </button>
  );
};

export default ToBottomBtn;
