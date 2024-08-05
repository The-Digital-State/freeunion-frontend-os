import { ReactComponent as CopyIcon } from '../../../icons/copy.svg';
import { ReactComponent as CheckboxIcon } from '../../../icons/checkbox.svg';
import { ReactComponent as MessagesIcon } from '../../../icons/messages.svg';
import { ReactComponent as DeleteIcon } from '../../../icons/delete.svg';
import { ReactComponent as ResendIcon } from '../../../icons/resend.svg';
import styles from './MessageModalContent.module.scss';
import { useDispatch, useSelector } from '../../../../redux';
import { deleteMessage, setDialogOptions, setIsReply, setIsSelectingMessagesMode } from 'shared/slices/chat';
import { toast } from 'react-toastify';
import List from '../TreadList/TreadList';
import { CHAT_INPUT_ID } from '../../../interfaces/chat';

function MessageModalContent({ modalProps, isMine }) {
  const dispatch = useDispatch();
  const activeThreadId = useSelector((state) => state.chat.activeThreadId);
  const selectedMessages = useSelector((state) => state.chat.selectedMessages);
  const isSelectingMessagesMode = useSelector((state) => state.chat.isSelectingMessagesMode);
  const organizationId = useSelector((state) => state.chat.organizationId);
  const messages = useSelector((state) => state.chat.messages);
  const selectedMessageId = useSelector((state) => state.chat.selectedMessageId);

  const toggleMessageModal = () => {
    dispatch(setDialogOptions({ top: '', left: '', isOpen: false }));
    dispatch(setIsSelectingMessagesMode(false));
  };

  const handleDeleteMessage = async () => {
    const answer = window.confirm('Удалить?')
    if (answer) {
      try {
        if (!isSelectingMessagesMode) {
          await dispatch(deleteMessage(activeThreadId, [selectedMessageId]));
        } else {
          await dispatch(deleteMessage(activeThreadId, selectedMessages));
        }
        toast('Сообщение удалено')
      } catch (error) {
        console.error(error);
        toast(error)
      }
      toggleMessageModal();
    }
  };
  const handleResend = (ev) => {
    const closeModal = () => {
      modalProps.closeModal();
      toggleMessageModal();
    }
    dispatch(setDialogOptions({ top: '', left: '', isOpen: false }));
    if (isSelectingMessagesMode) {
      ev.stopPropagation();
      if (organizationId) {
        modalProps.openModal(<List closeModal={closeModal} />);
      } else {
        modalProps.openModal({
          params: {
            mainContainer: <List closeModal={closeModal} />,
          },
        });
      }

    }
  };

  const focusOnInput = () => {
    const elem = document.getElementById(CHAT_INPUT_ID)
    if (elem) {
      elem.focus()
    }
  }

  return (
    <ul className={styles.wrapper}>
      {!isMine && !isSelectingMessagesMode && (
        <li
          onClick={() => {
            dispatch(setIsReply(true))
            focusOnInput();
            toggleMessageModal();
          }}
        >
          <MessagesIcon />
          <span>Ответить</span>
        </li>
      )}

      <li
        onClick={() => {
          if (isSelectingMessagesMode) {
            dispatch(setIsSelectingMessagesMode(false));
            toggleMessageModal();
          } else {
            dispatch(setIsSelectingMessagesMode(true));
            dispatch(setDialogOptions({ top: '', left: '', isOpen: false }));
          }
        }}
      >
        <CheckboxIcon />
        <span>{isSelectingMessagesMode ? 'Отменить' : 'Выбрать'}</span>
      </li>
      <li
        onClick={() => {
          let content = []
          if (isSelectingMessagesMode) {
            content = messages.filter(({ id }) => selectedMessages.includes(id));
          } else {
            content = messages.filter(({ id }) => id === selectedMessageId)
          }
          navigator.clipboard.writeText(content.map(({ content }) => content).join(', '));
          toast('Сообщение скопировано в буфер обмена');
          toggleMessageModal();
        }}
      >
        <CopyIcon />
        <span>Копировать</span>
      </li>
      <li
        onClick={handleResend}
        className={isSelectingMessagesMode && selectedMessages.length ? '' : styles.disabled}
      >
        <ResendIcon />
        <span>Переслать</span>
      </li>
      <li
        onClick={handleDeleteMessage}
      >
        <DeleteIcon />
        <span>Удалить</span>
      </li>
    </ul>
  );
}

export default MessageModalContent;
