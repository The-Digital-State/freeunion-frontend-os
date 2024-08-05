import { useEffect, useState } from 'react';
import ChatMessage from '../Message/Message';
import { useSelector } from '../../../../redux';
import styles from './ChatMessages.module.scss';
import cn from 'classnames';

const ChatMessages = () => {
  const messages = useSelector((state) => state.chat.messages);
  const threads = useSelector((state) => state.chat.threads);
  const activeThreadId = useSelector((state) => state.chat.activeThreadId);
  const [activeThread] = threads.filter(({ id }) => id === activeThreadId);
  // const [modifiedMessages, setMessages] = useState([]);
  const user = useSelector((state) => state.chat.user);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [messagesLength, setMessagesLength] = useState(messages.length);

  useEffect(() => {
    if (messagesLength !== messages.length) {
      setShouldScroll(true);
      setMessagesLength(messages.length);
    }
  }, [messages]);

  if (messages.length === 0) return null;
  return (
    <div className={cn(styles.wrapper, 'custom-scroll')}>
      {messages.map((message, index) => {
        return (
          <ChatMessage
            key={message.id}
            message={message}
            contactAvatar={activeThread?.avatar}
            userAvatar={user?.public_avatar || ''}
            shouldScroll={index === 0 && shouldScroll}
            setShouldScroll={setShouldScroll}
          />
        );
      })}
    </div>
  );
};

export default ChatMessages;
