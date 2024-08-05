import { FC } from 'react';
import { CardInfo, updateTask } from 'shared/services/tasks.service';
import { useDispatch, useSelector } from '../../../../redux';

import { setCardData } from 'shared/slices/tasks';
import { toast } from 'react-toastify';
import isEqual from 'lodash/isEqual';
import { Button } from 'shared/components/common/Button/Button';
import { Checkbox } from 'shared/components/common/Checkbox/Checkbox';
import styles from './KanbanCardModalActions.module.scss';
import { Select } from 'shared/components/common/Select/Select';
import formatServerError from 'shared/utils/formatServerError';

interface Props {
  card: CardInfo;
  onClose: () => void;
  orgId?: string;
}

// TODO: move to types
export enum TaskVisibility {
  noone = 0,
  all = 1,
  members = 2,
}

const taskVisibilities = [
  {
    id: TaskVisibility.all,
    label: 'Видно всем',
  },

  {
    id: TaskVisibility.members,
    label: 'Видно участникам объединения',
  },
  {
    id: TaskVisibility.noone,
    label: 'Видно из админки',
  },
];

const KanbanCardModalActions: FC<Props> = (props) => {
  const { card, onClose, orgId } = props;
  const dispatch = useDispatch();

  const hideModalActions = useSelector((state) => state.tasks.hideModalActions);
  const cardData = useSelector((state) => state.tasks.cardData);
  const { name, checklist, description, can_self_assign, visibility, is_urgent } = cardData;
  const updateCard = async () => {
    if (
      card.title === name &&
      card.description === description &&
      isEqual(
        card.checklist,
        checklist.reduce((acc, prev) => {
          acc[prev.name] = prev.state;
          return acc;
        }, {})
      )
    ) {
      onClose();
      return;
    }
    try {
      await updateTask(orgId, card.id, {
        ...card,
        can_self_assign,
        visibility,
        title: name,
        description,
        is_urgent,
        checklist: checklist.reduce((acc, prev) => {
          acc[prev.name] = prev.state;
          return acc;
        }, {}),
      });
      toast('Задача обновлена!');
      onClose();
    } catch (err) {
      console.log(err);
      toast.error(formatServerError(err.response.data.errors));
      console.dir(err);
    }
  };
  if (hideModalActions) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Checkbox
          valueChange={(checked, e) => {
            e.stopPropagation();
            dispatch(setCardData({ key: 'can_self_assign', value: checked }));
          }}
          isSquare
          label="Возможность взять задачу самостоятельно"
          value={card.can_self_assign}
        />
        <Checkbox
          valueChange={(checked, e) => {
            e.stopPropagation();
            dispatch(setCardData({ key: 'is_urgent', value: checked }));
          }}
          isSquare
          label="Пометить задачу как срочно"
          value={card.is_urgent}
        />

        <Select
          onSelect={(id) => {
            dispatch(setCardData({ key: 'visibility', value: id }));
          }}
          value={card.visibility}
          options={taskVisibilities}
          hasEmptyValue={false}
          className={styles.selectWrapper}
        />
      </div>

      <Button primary onClick={updateCard}>
        Cохранить
      </Button>
    </div>
  );
};

export default KanbanCardModalActions;
