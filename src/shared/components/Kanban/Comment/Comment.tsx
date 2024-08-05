import type { FC } from 'react';
import { useDispatch } from '../../../../redux';
import styles from './Comment.module.scss';
import { Input } from 'shared/components/common/Input/Input';
import { useState } from 'react';
import { format } from 'date-fns';
import { updateComment, removeComment } from 'shared/services/tasks.service';
import { getAllComments } from 'shared/slices/tasks';
import { CustomImage } from 'shared/Chat/components/CustomImage/CustomImage';
import buttonStyles from 'shared/components/common/Button/Button.module.scss';
import ru from 'date-fns/locale/ru';

interface KanbanCommentProps {
  createdAt: string;
  message: string;
  member: {
    public_name: string;
    public_avatar: string;
  };
  cardId: string;
  commentId: string;
  orgId?: string;
}

const KanbanComment: FC<KanbanCommentProps> = (props) => {
  const { createdAt, message, member, cardId, commentId, orgId } = props;

  const [commentMessage, setCommentMessage] = useState<string>(message);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const dispatch = useDispatch();

  const handleRemoveComment = async () => {
    await removeComment(orgId, cardId, commentId);
    dispatch(getAllComments(orgId, cardId));
  };

  const handleChange = (value): void => {
    setCommentMessage(value);
  };

  const handleKeyUp = async (): Promise<void> => {
    try {
      await updateComment(orgId, cardId, commentId, commentMessage);
      dispatch(getAllComments(orgId, cardId));
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <CustomImage src={member.public_avatar} alt="" width={40} height={40} />
      {isEditing ? (
        <div className={styles.editing}>
          <Input
            valueChange={handleChange}
            onEnter={handleKeyUp}
            withEnter
            value={commentMessage}
            placeholder="Комментарий"
            className={styles.inputWrapper}
          />
          <button onClick={handleKeyUp} className={buttonStyles.textButton}>
            Отправить
          </button>
          <button className={buttonStyles.textButton} onClick={() => setIsEditing(false)}>
            Отменить
          </button>
        </div>
      ) : (
        <div className={styles.commentContent}>
          <div className={styles.text}>
            <p className={styles.name}>{member.public_name}</p>
            <p className={styles.comment}>{message}</p>
          </div>
          <div className={styles.footer}>
            <p className={styles.time}>{format(new Date(createdAt), "dd/MM HH:mm", { locale: ru })}</p>
            <>
              <button onClick={() => setIsEditing(true)} className={buttonStyles.textButton}>
                Изменить
              </button>
              <button className={buttonStyles.textButton} onClick={handleRemoveComment}>
                Удалить
              </button>
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanComment;
