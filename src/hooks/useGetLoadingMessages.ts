import { useSelector } from 'react-redux';
import { selectLoadingMessage } from 'src/redux/slices/LoadingMessagesSlice';

const useGetLoadingMessages = () => {
  const { loadingMessagesArray } = useSelector(selectLoadingMessage);

  return {
    loadingMessagesArray,
  };
};

export default useGetLoadingMessages;
