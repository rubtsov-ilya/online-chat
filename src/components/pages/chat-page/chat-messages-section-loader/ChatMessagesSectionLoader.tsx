import { FC } from 'react';
import styles from './ChatMessagesSectionLoader.module.scss';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { CIRCULAR_LOADING_PERCENT_VALUE } from 'src/constants';

const ChatMessagesSectionLoader: FC = () => {
  return (
    <div className={styles['chat-messages-section-loader']}>
      <div
        className={
          styles['chat-messages-section-loader__circular-progressbar-wrapper']
        }
      >
        <CircularProgressbar
          className={
            styles['chat-messages-section-loader__circular-progressbar']
          }
          value={CIRCULAR_LOADING_PERCENT_VALUE}
          styles={buildStyles({
            // can use 'butt' or 'round'
            strokeLinecap: 'round',
            // How long animation takes to go from one percentage to another, in seconds
            pathTransitionDuration: 0.5,
            // Colors
            pathColor: 'var(--base-accent-blue)',
            /* textColor: '#f88', */
            trailColor: 'none',
          })}
        />
      </div>
    </div>
  );
};

export default ChatMessagesSectionLoader;
