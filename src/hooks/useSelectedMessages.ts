import { useSelector } from 'react-redux';
import { selectMessages } from 'src/redux/slices/SelectedMessagesSlice';

const useSelectedMessages = () => {
  const {
    isMessagesSelecting,
    selectedMessages,
    selectedChatId,
    isForwarding,
  } = useSelector(selectMessages);
  /* get in components - const { isMessagesSelecting, selectedMessages, selectedChatId, isForwarding, } = useSelectedMessages(); */

  return {
    isMessagesSelecting,
    selectedMessages,
    selectedChatId,
    isForwarding,
  };
};

export default useSelectedMessages;
