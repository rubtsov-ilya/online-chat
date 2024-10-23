import { useSelector } from 'react-redux';
import { selectMessagesArray } from 'src/redux/slices/MessagesArraySlice';

const useGetMessagesFromRtk = () => {
  const { messagesArray } = useSelector(selectMessagesArray);

  return {
    messagesArray,
  };
};

export default useGetMessagesFromRtk;
