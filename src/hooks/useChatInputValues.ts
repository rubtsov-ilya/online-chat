import { useSelector } from 'react-redux';
import { selectChatInputValues } from 'src/redux/slices/ChatInputValuesSlice';

const useChatInputValues = () => {
  const { chatInputValues } = useSelector(selectChatInputValues);
  /* get in components - const { chatInputValues } = useChatInputValues(); */

  return {
    chatInputValues
  };
};

export default useChatInputValues;
