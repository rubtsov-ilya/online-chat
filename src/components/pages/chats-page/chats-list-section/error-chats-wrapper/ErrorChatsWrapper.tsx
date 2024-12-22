import styles from './ErrorChatsWrapper.module.scss'
import EmptySvg from 'src/assets/images/icons/24x24-icons/Message.svg?react';

const ErrorChatsWrapper = () => {
  return (
    <div className={styles['wrapper']}>
      <div className={styles['icon-wrapper']}>
        <EmptySvg
          width={136}
          height={136}
          viewBox="0 0 24 24"
          className={styles['icon-wrapper__svg']}
        />
        <span className={styles['icon-wrapper__text']}>Ошибка загрузки!</span>
      </div>
    </div>
  )
}

export default ErrorChatsWrapper