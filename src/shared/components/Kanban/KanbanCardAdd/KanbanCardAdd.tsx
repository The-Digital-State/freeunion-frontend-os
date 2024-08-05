import { useState } from 'react';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { createTask } from 'shared/services/tasks.service';
import { addNewCard } from 'shared/slices/tasks';
import { useDispatch } from '../../../../redux';
import { toast } from 'react-toastify';

import styles from './KanbanCardAdd.module.scss';
import { Input } from 'shared/components/common/Input/Input';
import { Button } from 'shared/components/common/Button/Button';
import formatServerError from 'shared/utils/formatServerError';
import buttonStyles from 'shared/components/common/Button/Button.module.scss';

interface KanbanCardAddProps {
  columnId: number;
  isAdminApp: boolean;
}

const KanbanCardAdd: FC<KanbanCardAddProps> = ({ columnId }) => {
  const [title, setTitle] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { organizationId: orgId } = useParams<{ organizationId?: string }>();
  const dispatch = useDispatch();
  const handleChange = (value: string): void => {
    setTitle(value);
  };

  const handleAddInit = (): void => {
    setIsExpanded(true);
  };

  const handleAddCancel = (): void => {
    setIsExpanded(false);
    setTitle('');
  };

  const handleAddConfirm = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const {
        data: { data },
      } = await createTask(orgId, { title, column_id: columnId, index: -1, can_self_assign: false, is_urgent: false, visibility: 0 });
      dispatch(addNewCard(data));
      toast('Задача создана!');
      setIsExpanded(false);
      setTitle('');
    } catch (error) {
      toast.error(formatServerError(error));
    }
    setIsLoading(false);
  };

  return (
    <>
      {isExpanded ? (
        <>
          <Input placeholder="Заголовок" name="cardName" autoFocus valueChange={handleChange} value={title} />
          <div className={styles.wrapper}>
            <Button onClick={handleAddConfirm} primary disabled={isLoading}>
              Добавить
            </Button>
            <Button onClick={handleAddCancel}>Отменить</Button>
          </div>
        </>
      ) : (
        <button className={buttonStyles.textButton} onClick={handleAddInit}>
          Cоздать задачу
        </button>
      )}
    </>
  );
};

export default KanbanCardAdd;
