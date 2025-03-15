import { FC } from 'react';
import styles from './MessageContextMenuButton.module.scss';

interface MessageContextMenuButtonProps {
  text: string;
  Svg: React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
    titleId?: string | undefined;
    desc?: string | undefined;
    descId?: string | undefined;
  }>;
  onClick: () => void;
  accentColor?: 'red';
}
const MessageContextMenuButton: FC<MessageContextMenuButtonProps> = ({
  text,
  Svg,
  onClick,
  accentColor,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${styles['message-context-menu-button']} ${accentColor ? styles[accentColor] : ''}`}
    >
      <Svg
        className={`${styles['message-context-menu-button__icon']} ${accentColor ? styles[accentColor] : ''}`}
      />
      <span
        className={`${styles['message-context-menu-button__text']} ${accentColor ? styles[accentColor] : ''}`}
      >
        {text}
      </span>
    </button>
  );
};

export default MessageContextMenuButton;
