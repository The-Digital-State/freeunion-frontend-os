import { ReactComponent as BlockIcon } from '../../../icons/block.svg';
import { ReactComponent as UnblockIcon } from '../../../icons/unblock.svg';
import { ReactComponent as CleanIcon } from '../../../icons/clean-chat.svg';
import { ReactComponent as VolumeOnIcon } from '../../../icons/volume-on.svg';
import { ReactComponent as VolumeOffIcon } from '../../../icons/volume-off.svg';
import { ReactComponent as DeleteIcon } from '../../../icons/delete.svg';

import { useDispatch, useSelector } from '../../../../redux';
import {
  blockThread,
  clearThread,
  deleteConversation,
  muteThread,
  setDialogOptions,
  unBlockThread,
  unmuteThread,
} from 'shared/slices/chat';
import { toast } from 'react-toastify';

function ConversationModalContent() {
  const dispatch = useDispatch();
  const threadId = useSelector((state) => state.chat.activeThreadId);
  const threads = useSelector((state) => state.chat.threads);
  const [activeThread] = threads.filter(({ id }) => id === threadId);
  const toggleConversations = () => {
    dispatch(setDialogOptions({ top: '', left: '', isOpen: false }));
  };
  if (!activeThread) return null;
  return (
    <ul>
      <li
        onClick={() => {
          if (activeThread.is_blocked) {
            dispatch(unBlockThread());
            toast('Чат разблокирован');
          } else {
            dispatch(blockThread());
            toast('Чат заблокирован');
          }
          toggleConversations();
        }}
      >
        {activeThread.is_blocked ? <UnblockIcon /> : <BlockIcon />}
        <span>{activeThread.is_blocked ? 'Разблокировать' : 'Заблокировать'}</span>
      </li>
      <li
        onClick={() => {
          dispatch(clearThread());
          toast('Сообщения удалены');

          toggleConversations();
        }}
      >
        <CleanIcon />
        <span>Очистить историю</span>
      </li>

      <li
        onClick={() => {
          if (activeThread.is_muted) {
            dispatch(unmuteThread());
            toast('Уведомления включены');
          } else {
            dispatch(muteThread());
            toast('Уведомления выключены');
          }
          toggleConversations();
        }}
      >
        {activeThread.is_muted ? <VolumeOnIcon /> : <VolumeOffIcon />}
        <span> {activeThread.is_muted ? 'Включить звук' : 'Выключить звук'}</span>
      </li>
      <li
        onClick={async () => {
          toggleConversations();
          const answer = window.confirm('Удалить?')
          if (answer) {
            await dispatch(deleteConversation(threadId));
            toast('Диалог удален');
          }
        }}
      >
        <DeleteIcon />
        <span>Удалить</span>
      </li>
    </ul>
  );
}

export default ConversationModalContent;
