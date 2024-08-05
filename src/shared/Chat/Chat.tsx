import { useEffect, useMemo } from 'react';
import { ChatSidebar, ChatThread } from './components';
import styles from './Chat.module.scss';
import { createThread, getThreads, setUserData, getMessages, setActiveThreadId } from 'shared/slices/chat';
import { useDispatch, useSelector } from '../../redux';
import DialogModal from './components/Dialog/DialogModal';
import { toast } from 'react-toastify';
import { useLocation, useHistory } from 'react-router';
import { ChatModalProps } from 'shared/interfaces/chat';
import { Helmet } from 'react-helmet';

type ChatProps = ChatModalProps & {
  getUserData: () => void;
};

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const Chat = ({ openModal, getUserData, closeModal, getOrganizationUsers }: ChatProps) => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const history = useHistory();
  const user = useSelector((state) => state.chat.user);
  const threads = useSelector((state) => state.chat.threads);
  const isThreadsLoaded = useSelector((state) => state.chat.isThreadsLoaded);
  const activeThreadId = useSelector((state) => state.chat.activeThreadId);
  const newMessages = threads.reduce((prev, { new_messages }) => prev + new_messages, 0);

  let query = useQuery();
  const loadThreads = () => {
    dispatch(getThreads());
  };

  const loadMessages = async (conversationId) => {
    dispatch(setActiveThreadId(conversationId));
    dispatch(getMessages(conversationId));
  };

  useEffect(() => {
    if (!(query.get('id') && query.get('type') && user)) {
      (async () => {
        await loadThreads();
        if (query.get('conversation_id')) {
          loadMessages(query.get('conversation_id'));
        }
      })()
    }
    (async () => {
      try {
        const user = await getUserData();
        dispatch(setUserData(user));
      } catch (error) {
        toast(error);
      }
    })();
    const interval = setInterval(loadThreads, 1000 * 600);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (query.get('id') && query.get('type') && user) {
      dispatch(createThread(query.get('id'), query.get('type')));
      history.replace({
        search: '',
      });
    }
  }, [search, user]);

  useEffect(() => {
    if (isThreadsLoaded && !activeThreadId && threads[0]) {
      dispatch(setActiveThreadId(threads[0].id));
      loadMessages(threads[0].id);
    }
  }, [isThreadsLoaded, activeThreadId])

  const getTitle = () => {
    let title = 'Чат';
    if (newMessages > 0) {
      title = `Пришло ${newMessages} сообщени`;
      if (newMessages > 4) {
        title = `${title}й`;
      } else if (newMessages > 1) {
        title = `${title}я`;
      } else {
        title = `${title}e`;
      }
    }
    return title;
  };

  const title = getTitle();

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <DialogModal
        modalProps={{
          openModal,
          closeModal,
        }}
      />
      <div className={styles.ChatSidebarContainer}>
        <ChatSidebar
          modalProps={{
            openModal,
            closeModal,
            getOrganizationUsers,
          }}
        />
        <ChatThread />
      </div>
    </>
  );
};

export default Chat;
