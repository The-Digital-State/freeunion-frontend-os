import { useDispatch } from '../../../../redux';
import styles from './KanbanCommentAdd.module.scss';
import type { FC } from 'react';
import { addComment } from 'shared/services/tasks.service';
import { getAllComments } from 'shared/slices/tasks';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { CustomImage } from 'shared/Chat/components/CustomImage/CustomImage';
import { Button } from 'shared/components/common/Button/Button';
import { Input } from 'shared/components/common/Input/Input';
import formatServerError from 'shared/utils/formatServerError';

interface KanbanCommentAddProps {
  cardId: string;
  orgId?: string;
}

const KanbanCommentAdd: FC<KanbanCommentAddProps> = (props) => {
  const { cardId, orgId } = props;
  const [message, setMessage] = useState<string>('');
  const dispatch = useDispatch();

  const handleChange = (value): void => {
    setMessage(value);
  };

  const handleAddComment = async (): Promise<void> => {
    try {
      await addComment(orgId, cardId, message);
      setMessage('');
      dispatch(getAllComments(orgId, cardId));
    } catch (err) {
      toast.error(formatServerError(err));
      console.error(err);
    }
  };
  return (
    <div className={styles.wrapper}>
      <CustomImage src="" alt="" width="40px" height="40px" />
      <Input
        valueChange={handleChange}
        onEnter={handleAddComment}
        withEnter
        className={styles.inputWrapper}
        placeholder="Добавить комментарий"
        value={message}
      />
      <Button primary onClick={handleAddComment}>
        Добавить
      </Button>
    </div>
  );
};

export default KanbanCommentAdd;
