import { FC } from 'react';
import styles from './CircularLoadingProgressbar.module.scss';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import CloseSvg from 'src/assets/images/icons/24x24-icons/Close.svg?react';
import 'react-circular-progressbar/dist/styles.css';

interface CircularLoadingProgressbarProps {
  progress: number;
  isFile?: boolean;
  cancelUploads: () => void;
}

const CircularLoadingProgressbar: FC<CircularLoadingProgressbarProps> = ({
  progress,
  isFile,
  cancelUploads,
}) => {
  return (
    <>
      {/* нельзя делать без фрагмента, если сделать общую обёртку, относительно которой затем разместить лоудер и крестик, тогда крестик и лоудер станут сильно размытыми */}
      <button
        onClick={cancelUploads}
        className={`${styles['circular-progressbar-btn']} ${isFile ? styles['circular-progressbar-btn--file'] : ''}`}
      >
        <CircularProgressbar
          className={styles['circular-progressbar']}
          value={progress === 0 ? 1 : progress}
          styles={buildStyles({
            // Rotation of path and trail, in number of turns (0-1)
            /* rotation: 0.25, */
            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
            strokeLinecap: 'round',
            // How long animation takes to go from one percentage to another, in seconds
            pathTransitionDuration: 0.5,
            // Colors
            pathColor: 'rgb(255, 255, 255)',
            /* textColor: '#f88', */
            trailColor: 'none',
          })}
        />
      </button>
      <button
        onClick={cancelUploads}
        className={styles['circular-progressbar-cross']}
      >
        <CloseSvg
          className={`${styles['circular-progressbar-cross__icon']} ${isFile ? styles['circular-progressbar-cross__icon--file'] : ''}`}
        />
      </button>
    </>
  );
};

export default CircularLoadingProgressbar;
