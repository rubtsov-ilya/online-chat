import { FC } from 'react';
import styles from './AttachedContentWrapper.module.scss';
import CrossSvg from 'src/assets/images/icons/24x24-icons/Close.svg?react';
import FileSvg from 'src/assets/images/icons/24x24-icons/File.svg?react';
import { AttachedItemType } from 'src/interfaces/AttachedItem.interface';

interface AttachedContentWrapperProps {
  attachedItems: AttachedItemType[];
  setAttachedItems: React.Dispatch<React.SetStateAction<AttachedItemType[]>>;
}

const AttachedContentWrapper: FC<AttachedContentWrapperProps> = ({
  attachedItems,
  setAttachedItems,
}) => {
  return (
    <div className={styles['attached-content-wrapper']}>
      {attachedItems.map((item, index) => (
        <div key={index} className={styles['attached-content-wrapper__item']}>
          {'imgUrl' in item && (
            <img
              className={styles['attached-content-wrapper__media']}
              src={item.imgUrl}
            />
          )}
          {'videoUrl' in item && (
            <video
              className={styles['attached-content-wrapper__media']}
              src={item.videoUrl}
            />
          )}
          {'isFile' in item && (
            <div className={styles['attached-content-wrapper__file-wrapper']}>
              <FileSvg
                className={styles['attached-content-wrapper__file-icon']}
              />
              <span className={styles['attached-content-wrapper__file-name']}>
                {item.name}
              </span>
            </div>
          )}
          <button
            onClick={() => {
              setAttachedItems(
                attachedItems.filter((filteredItem) => filteredItem !== item),
              );
            }}
            className={styles['attached-content-wrapper__cross-btn']}
          >
            <CrossSvg
              className={`${styles['attached-content-wrapper__cross-icon']} ${'fileUrl' in item ? styles['attached-content-wrapper__cross-icon--file'] : ''}`}
            />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AttachedContentWrapper;
