import { useSelector } from 'react-redux';
import { selectMessages } from 'src/redux/slices/SelectedMessagesSlice';

const useSelectedMessages = () => {
  const { isMessagesSelecting, selectedMessages } = useSelector(selectMessages);
  /* get in components - const { isMessagesSelecting, selectedMessages } = useSelectedMessages(); */

  return {
    isMessagesSelecting,
    selectedMessages,
  };
};

export default useSelectedMessages;
