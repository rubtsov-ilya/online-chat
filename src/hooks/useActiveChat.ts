import { useSelector } from 'react-redux';
import { selectActiveChat } from 'src/redux/slices/ActiveChatSlice';

const useActiveChat = () => {
  const { activeChatId, activeChatAvatar, activeChatBlocked, activeChatname, activeChatMembers, activeChatIsGroup, activeChatGroupAdminUrl } = useSelector(selectActiveChat);
  /* get in components - const { activeChatId, activeChatAvatar, activeChatBlocked, activeChatname, activeChatMembers, activeChatIsGroup, activeChatGroupAdminUrl } = useGetActiveChat(); */

  return {
    activeChatId,
    activeChatAvatar,
    activeChatBlocked,
    activeChatname,
    activeChatMembers,
    activeChatIsGroup,
    activeChatGroupAdminUrl,
  };
};

export default useActiveChat;
