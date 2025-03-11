import { FC } from 'react';
import styles from './AttachedContentWrapper.module.scss';
import CrossSvg from 'src/assets/images/icons/24x24-icons/Close.svg?react';
import FileSvg from 'src/assets/images/icons/24x24-icons/File.svg?react';
import { AttachedItemType } from 'src/interfaces/AttachedItem.interface';
import { useDispatch } from 'react-redux';
import { filterAttachedItemsChatInputValue } from 'src/redux/slices/ChatInputValuesSlice';

interface AttachedContentWrapperProps {
  activeChatId: string | null;
  attachedItems: AttachedItemType[];
}

const AttachedContentWrapper: FC<AttachedContentWrapperProps> = ({
  activeChatId,
  attachedItems,
}) => {
  const dispatch = useDispatch();

  return (
    <div className={styles['attached-content-wrapper']}>
      {attachedItems.map((attachedItem, index) => (
        <div key={index} className={styles['attached-content-wrapper__item']}>
          {'imgUrl' in attachedItem && (
            <img
              className={styles['attached-content-wrapper__media']}
              src={attachedItem.imgUrl}
            />
          )}
          {'videoUrl' in attachedItem && (
            <video
              className={styles['attached-content-wrapper__media']}
              src={attachedItem.videoUrl}
            />
          )}
          {'isFile' in attachedItem && (
            <div className={styles['attached-content-wrapper__file-wrapper']}>
              <FileSvg
                className={styles['attached-content-wrapper__file-icon']}
              />
              <span className={styles['attached-content-wrapper__file-name']}>
                {attachedItem.name}
              </span>
            </div>
          )}
          <button
            onClick={() => {
              dispatch(
                filterAttachedItemsChatInputValue({
                  chatId: activeChatId,
                  attachedItem: attachedItem
                }),
              );
            }}
            className={styles['attached-content-wrapper__cross-btn']}
          >
            <CrossSvg
              className={`${styles['attached-content-wrapper__cross-icon']} ${'fileUrl' in attachedItem ? styles['attached-content-wrapper__cross-icon--file'] : ''}`}
            />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AttachedContentWrapper;
