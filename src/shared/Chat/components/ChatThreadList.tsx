import ChatItem from './ChatItem/ChatItem';
import { useDispatch, useSelector } from '../../../redux';
import { getMessages, setActiveThreadId } from 'shared/slices/chat';

const ChatThreadList = () => {
  const dispatch = useDispatch();
  const threads = useSelector((state) => state.chat.threads);
  const searchQuery = useSelector(state => state.chat.searchQuery);
  const filteredThreads = searchQuery ? threads.filter(({ name }) => name?.toLowerCase().includes(searchQuery?.toLowerCase())) : threads
  return (
    <>
      {filteredThreads?.map((thread) => (
        <ChatItem
          key={thread.id}
          onSelect={(): void => {
            dispatch(setActiveThreadId(thread.id));
            dispatch(getMessages(thread.id));
          }}
          thread={thread}
        />
      ))}
    </>
  );
};

export default ChatThreadList;
