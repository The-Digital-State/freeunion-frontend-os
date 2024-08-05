import { useEffect } from 'react';
import ChatMessageAdd from '../ChatMessageAdd';
import ChatMessages from '../ChatMessages/ChatMessages';
import { useDispatch, useSelector } from '../../../../redux';
import { getMessages } from 'shared/slices/chat';
import styles from './ChatThread.module.scss';

const ChatThread = () => {
  const activeThreadId = useSelector((state) => state.chat.activeThreadId);
  const threads = useSelector((state) => state.chat.threads);
  const isSelectingMessagesMode = useSelector((state) => state.chat.isSelectingMessagesMode);
  const isThreadsLoaded = useSelector((state) => state.chat.isThreadsLoaded);
  const [thread] = (threads || []).filter(({ id }) => Number(activeThreadId) === Number(id));
  const dispatch = useDispatch();
  const loadMessages = (shouldLoad) => {
    if (activeThreadId && shouldLoad) {
      dispatch(getMessages(activeThreadId));
    }
  };
  useEffect(() => {
    const interval = setInterval(() => loadMessages(!isSelectingMessagesMode), 1000 * 600);
    return () => {
      clearInterval(interval);
    };
  }, [activeThreadId, isSelectingMessagesMode]);

  return (
    <div className={styles.wrapper}>
      {thread && (
        <div className={styles.threadHeader}>
          <p>{thread.name}</p>
        </div>
      )}
      {!activeThreadId && isThreadsLoaded && <div className={styles.ThreadMessage}>
        <h4>{threads.length > 0 ? 'Выберите диалог' : 'У вас нет диалогов'}</h4>
      </div>}
      <div className={styles.threadContent}>{activeThreadId && <ChatMessages />}</div>
      {activeThreadId && <ChatMessageAdd />}
    </div>
  );
};

export default ChatThread;
