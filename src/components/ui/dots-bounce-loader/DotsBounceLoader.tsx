import styles from './DotsBounceLoader.module.scss';

const DotsBounceLoader = () => {
  return (
    <>
      <span className={styles['dot']}>.</span>
      <span className={styles['dot']}>.</span>
      <span className={styles['dot']}>.</span>
    </>
  );
};

export default DotsBounceLoader;
