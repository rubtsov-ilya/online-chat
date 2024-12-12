import { createPortal } from 'react-dom';
import './CustomToastContainer.scss';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let currentToastId: string | number | null = null; // Хранит id текущего активного тоста

const customToastError = (message: string) => {
  // Если тост уже активен
  if (currentToastId) {
    return;
  }

  // Создаем новый тост с уникальным id
  const id = toast.error(message, {
    className: 'custom-toast-error',
    onClose: () => {
      // Когда тост закрывается, сбрасываем id
      currentToastId = null;
    },
  });

  // Сохраняем id активного тоста
  currentToastId = id;
};

const CustomToastContainer = () => {
  return createPortal(
    <ToastContainer
      position="top-right"
      autoClose={2000}
      limit={1}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />,
    document.getElementById('toastify') as HTMLDivElement,
  );
};

export default CustomToastContainer;

export { customToastError };
