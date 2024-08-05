import { useState, FormEvent } from 'react';
import styles from './CommentCardModal.module.scss';
import { TextArea } from 'shared/components/common/TextArea/TextArea';
import { Button } from 'shared/components/common/Button/Button';

const CommentCardModal = (props) => {
  const { onClose } = props;
  const [comment, setComment] = useState('');

  function submit(e: FormEvent<HTMLFormElement>) {
    if (comment.length < 1) {
      return;
    }
    e.preventDefault();

    setComment('');
    onClose(comment);
  }

  return (
    <div className={styles.CommentCardModal}>
      <form onSubmit={submit}>
        <TextArea
          valueChange={(value) => {
            setComment(value);
          }}
          placeholder="Добавить комментарий"
          label="Комментарий"
          name="Комментарий"
          value={comment}
          rows={6}
        />
        <p>Для того чтобы взять или переместить задачу нужно оставить комментарий не меннее 120 символов</p>
        <div className={styles.action}>
          <Button primary type="submit" className={styles.actionButton} disabled={comment.length < 1}>
            Cохранить
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommentCardModal;
