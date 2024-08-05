import { CustomImage } from '../CustomImage/CustomImage';
import { useEffect, useRef } from 'react';
import styles from './ChatItem.module.scss';
import { useSelector, useDispatch } from '../../../../redux';
import { setDialogOptions, Thread, setMessagesViewed } from 'shared/slices/chat';
import Tooltip from 'shared/components/common/Tooltip/Tooltip';

interface ChatThreadItemProps {
  thread: Thread;
  onSelect: () => void;
}

const ChatItem = ({ onSelect, thread }: ChatThreadItemProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>();
  const dispatch = useDispatch();
  const activeStateId = useSelector((state) => state.chat.activeThreadId);
  const dialogOptions = useSelector((state) => state.chat.dialogOptions);

  useEffect(() => {
    if (thread && thread.id === activeStateId && thread.new_messages > 0) {
      dispatch(setMessagesViewed());
    }
  }, [thread, activeStateId]);

  if (!thread) return null;

  const handleMenuOpen = (event) => {
    event.preventDefault();

    if (activeStateId === thread.id) {
      if (ref && ref.current) {
        const { top, left } = ref?.current.getBoundingClientRect();
        if (dialogOptions.top !== top || dialogOptions.left !== left) {
          dispatch(setDialogOptions({ top, left, isOpen: true, isMessageModal: false }));
        }
      }
    }
  };

  const selectItem = () => {
    if (activeStateId !== thread.id) {
      onSelect();
    }
  };

  return (
    <Tooltip title={thread.name}>
      <div
        ref={ref}
        onClick={selectItem}
        onContextMenu={handleMenuOpen}
        className={styles.header}
        style={
          Number(activeStateId) === Number(thread.id)
            ? { background: 'linear-gradient(138.63deg, #828ECC 26.98%, #C6C4F1 100%)', borderRadius: 15 }
            : {}
        }
      >
        <div className={styles.avatar}>
          <CustomImage src={thread.avatar} alt={''} width={75} height={75} />
        </div>
        <div className={styles.info}>
          <p className={styles.title}>{thread.name}</p>
          <p className={styles.message}>{thread?.last_message?.content}</p>
        </div>
        {thread?.new_messages && activeStateId !== thread.id ? (
          <span className={styles.messageCount}>{thread?.new_messages}</span>
        ) : null}
      </div>
    </Tooltip>
  );
};

export default ChatItem;
