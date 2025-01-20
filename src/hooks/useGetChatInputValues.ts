import { useSelector } from 'react-redux';
import { selectChatInputValues } from 'src/redux/slices/ChatInputValues';

const useGetChatInputValues = () => {
  const { chatInputValues } = useSelector(selectChatInputValues);
  /* get in components - const { chatInputValues } = useGetChatInputValues(); */

  return {
    chatInputValues
  };
};

export default useGetChatInputValues;
