import useBodyLock from './useBodyLock';

interface UseToggleModalProps<T> {
  setCbState: (value: React.SetStateAction<T>) => void;
}

const useToggleModal = <T>({ setCbState }: UseToggleModalProps<T>) => {
  const { toggleBodyLock } = useBodyLock();

  const toggleModal = (state: T, timer?: number): void => {
    if (timer) {
      // задержка для отработки анимации при закрытии окна
      toggleBodyLock();
      setTimeout(() => {
        setCbState(state);
      }, timer);
    } else {
      setCbState(state);
      toggleBodyLock();
    }
  };

  return { toggleModal };
};

export default useToggleModal;

// использование
// const [modalOpen, setModalOpen] = useState<'ban' | 'delete' | false>(false);
// const { toggleModal } = useToggleModal({ setCbState: setModalOpen });
// 
// const openModal = () => toggleModal('ban');
// const closeModal = () => toggleModal(false, 100);
// 
// {modalOpen && (
//   //аргумент number в toggleModal - длительность transition opacity в modal-backdrop 
//   <ModalBackdrop
//     toggleModal={() => toggleModal(false, 100)}
//     divIdFromIndexHtml={'modal-backdrop'}
//   >
//     <ModalActionConfirm
//       isMobileScreen={isMobileScreen}
//       title={modalActionData[modalOpen].title}
//       subtitle={modalActionData[modalOpen].subtitle}
//       actionBtnText={modalActionData[modalOpen].actionBtnText}
//       action={modalActionData[modalOpen].action}
//       avatar={userAvatarImg}
//     />
//   </ModalBackdrop>
// )}
