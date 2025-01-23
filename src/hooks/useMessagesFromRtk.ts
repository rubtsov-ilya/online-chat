import { useSelector } from 'react-redux';
import { selectMessagesArray } from 'src/redux/slices/MessagesArraySlice';

const useMessagesFromRtk = () => {
  const { messagesArray } = useSelector(selectMessagesArray);

  /* get in components - const { messagesArray } = useGetMessagesFromRtk(); */

  return {
    messagesArray,
  };
};

export default useMessagesFromRtk;
