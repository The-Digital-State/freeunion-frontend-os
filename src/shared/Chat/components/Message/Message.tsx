import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import { CustomImage } from '../CustomImage/CustomImage';
import styles from './Message.module.scss';
import Linkify from 'react-linkify';
import { Checkbox } from 'shared/components/common/Checkbox/Checkbox';
import { useDispatch, useSelector } from '../../../../redux';
import { Message, setDialogOptions, setIsReply, setSelectedMessageId, setSelectedMessages } from 'shared/slices/chat';
import { format } from 'date-fns';
import ru from 'date-fns/locale/ru';
import cn from 'classnames';

import { ReactComponent as StatusIcon } from 'shared/icons/message-status.svg';

interface ChatMessageProps {
  message: Message;
  userAvatar: string;
  contactAvatar: string;
  shouldScroll: boolean;
  setShouldScroll: (value: boolean) => void;
}

const ChatMessage: FC<ChatMessageProps> = (props) => {
  const ref = useRef<HTMLDivElement>();
  const { message, shouldScroll, setShouldScroll, userAvatar, contactAvatar } = props;
  const { content: body, is_seen, type, senderType, id, isPrevMessageMine, created_at: createdAt, data } = message;
  const dispatch = useDispatch();
  const dialogOptions = useSelector((state) => state.chat.dialogOptions);
  const selectedMessages = useSelector((state) => state.chat.selectedMessages);
  const isSelectingMessagesMode = useSelector((state) => state.chat.isSelectingMessagesMode);
  const isChecked = selectedMessages.filter((key) => key === id).length !== 0;
  const isMine = senderType === 'user';
  const handleOpenModal = (event) => {
    event.preventDefault();
    if (dialogOptions.top !== event.clientY || dialogOptions.left !== event.clientX) {
      dispatch(
        setDialogOptions({
          left: event.clientX,
          top: event.clientY,
          isOpen: true,
          isMessageModal: true,
          isMine,
        })
      );
      dispatch(setSelectedMessageId(id));
      dispatch(setIsReply(false));
    }
  };
  const handleCheckboxClick = (value, event) => {
    event.stopPropagation();
    dispatch(setSelectedMessages({ id, value }));
  };
  useEffect(() => {
    if (ref && ref.current && shouldScroll) {
      ref.current.scrollIntoView(false);
      setShouldScroll(false);
    }
  }, [shouldScroll]);
  let seenInfo = is_seen && isMine;
  return (
    <>
      <div className={cn(styles.wrapper, { [styles.mineMessage]: isMine && !isSelectingMessagesMode })}>
        {
          <CustomImage
            src={isMine ? userAvatar : contactAvatar}
            alt={''}
            width={42}
            height={42}
            className={cn(styles.avatar, { [styles.hide]: isPrevMessageMine })}
          />
        }
        {isSelectingMessagesMode && <Checkbox isSquare value={isChecked} valueChange={handleCheckboxClick} />}
        <div
          className={cn(styles.messageContent, { [styles.messageContentContact]: !isMine })}
          onContextMenu={handleOpenModal}
          onClick={(event) => {
            if (isSelectingMessagesMode) {
              handleCheckboxClick(!isChecked, event);
            }
          }}
          ref={ref}
        >
          {type === 'image' ? (
            <img alt="Attachment" width="450px" src={body} />
          ) : (
            <Linkify
              componentDecorator={(decoratedHref, decoratedText, key) => (
                <a target="blank" href={decoratedHref} key={key}>
                  {decoratedText}
                </a>
              )}
            >
              {body}
            </Linkify>
          )}
          {data && data.length > 0 && <div className={styles.repliedContent}>{data.join(' ')}</div>}
        </div>
        <div className={styles.messageInfo}>
          <time>{format(new Date(createdAt), 'dd/MM HH:mm', { locale: ru })}</time>
          {seenInfo && (
            <span className={styles.seen}>
              <StatusIcon />
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatMessage;
