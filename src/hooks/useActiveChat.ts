import { useSelector } from 'react-redux';
import { selectActiveChat } from 'src/redux/slices/ActiveChatSlice';

const useActiveChat = () => {
  const { activeChatId, activeChatAvatar, activeChatBlocked, activeChatname, activeChatMembers, activeChatIsGroup } = useSelector(selectActiveChat);
  /* get in components - const { activeChatId, activeChatAvatar, activeChatBlocked, activeChatname, activeChatMembers, activeChatIsGroup } = useGetActiveChat(); */

  return {
    activeChatId,
    activeChatAvatar,
    activeChatBlocked,
    activeChatname,
    activeChatMembers,
    activeChatIsGroup,
  };
};

export default useActiveChat;
