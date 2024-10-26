import styles from './CircularLoadingProgressbar.module.scss';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CircularLoadingProgressbar = () => {
  const percentage = 56;
  return (
    <div className={styles['circular-progressbar-wrapper']}>
      <CircularProgressbar
        className={styles['circular-progressbar']}
        value={percentage}
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
    </div>
  );
};

export default CircularLoadingProgressbar;