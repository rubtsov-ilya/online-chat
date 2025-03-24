import { useSelector } from 'react-redux';
import { selectMessages } from 'src/redux/slices/SelectedMessagesSlice';

const useSelectedMessages = () => {
  const {
    isMessagesSelecting,
    selectedMessages,
    selectedChatId,
    selectedChatMembers,
    isMessagesForwarding,
  } = useSelector(selectMessages);
  /* get in components - const { isMessagesSelecting, selectedMessages, selectedChatMembers, selectedChatId, isMessagesForwarding } = useSelectedMessages(); */

  return {
    isMessagesSelecting,
    selectedMessages,
    selectedChatId,
    selectedChatMembers,
    isMessagesForwarding,
  };
};

export default useSelectedMessages;
