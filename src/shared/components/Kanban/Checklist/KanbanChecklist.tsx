import { useState } from 'react';
import type { FC } from 'react';
import KanbanCheckItem from './KanbanCheckItem';
import KanbanCheckItemAdd from './KanbanCheckItemAdd';
import Section from '../Section/Section';
import { useDispatch, useSelector } from '../../../../redux';
import { setCardData, setVisiability } from 'shared/slices/tasks';
import styles from './Checklist.module.scss';
import buttonStyles from 'shared/components/common/Button/Button.module.scss';
import { StepsProgressBar } from 'shared/components/common/StepsProgressBar/StepsProgressBar';
import { CardInfo } from 'shared/services/tasks.service';

interface Props {
  card: CardInfo;
}
const KanbanChecklist: FC<Props> = (props) => {
  const { card } = props;

  const dispatch = useDispatch();
  const checklistItems = useSelector((state) => state.tasks.cardData.checklist);
  const [editingCheckItem, setEditingCheckItem] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleStateChange = async (value: boolean, id: number): Promise<void> => {
    const state = value ? 1 : 0;
    dispatch(
      setCardData({
        key: 'checklist',
        value: checklistItems.map((item) => (item.id === id ? { ...item, state } : item)),
      })
    );
  };

  const handleDelete = async (): Promise<void> => {
    dispatch(
      setCardData({
        key: 'checklist',
        value: [],
      })
    );
    dispatch(setVisiability({ key: 'checklist', value: false }));
  };

  const handleAddCheckItem = (name: string) => {
    dispatch(
      setCardData({
        key: 'checklist',
        value: [...checklistItems, { name, id: checklistItems.length, state: 0 }],
      })
    );
  };

  const handleDeleteCheckItem = (id: string) => {
    dispatch(
      setCardData({
        key: 'checklist',
        value: checklistItems.filter((checkItem) => checkItem.id !== id),
      })
    );
  };

  const handleCheckItemEditInit = (checkItemId: string): void => {
    setEditingCheckItem(checkItemId);
  };

  const handleCheckItemEditCancel = (): void => {
    setEditingCheckItem(null);
  };

  const handleCheckItemEditComplete = (updatedCheckItem): void => {
    dispatch(
      setCardData({
        key: 'checklist',
        value: checklistItems.map((checkItem) => (checkItem.id === updatedCheckItem.id ? updatedCheckItem : checkItem)),
      })
    );
    setEditingCheckItem(null);
  };

  const totalCheckItems = checklistItems.length;
  const completedCheckItems = checklistItems.filter((checkItem) => checkItem.state === 1).length;
  const completePercentage = totalCheckItems === 0 ? 100 : (completedCheckItems / totalCheckItems) * 100;

  return (
    <Section
      title="Чеклист"
      actions={
        <>
          <button className={buttonStyles.textButton} onClick={() => setIsExpanded(true)}>
            Добавить пункт
          </button>
          <button className={buttonStyles.textButton} onClick={handleDelete}>
            Удалить чеклист
          </button>
        </>
      }
    >
      <div className={styles.checklistWrapper}>
        <div className={styles.progressBar}>
          <StepsProgressBar stepNumber={completedCheckItems} stepsCount={totalCheckItems} />
        </div>
        <p>{Math.round(completePercentage)}%</p>
      </div>
      <div
        style={{
          marginLeft: 8,
        }}
      >
        <KanbanCheckItemAdd isExpanded={isExpanded} setIsExpanded={setIsExpanded} addCheckItem={handleAddCheckItem} />
      </div>
      {checklistItems.map((checkItem) => (
        <KanbanCheckItem
          cardId={card.id}
          checkItem={checkItem}
          editing={editingCheckItem === checkItem.id}
          key={checkItem.id}
          handleDeleteCheckItem={handleDeleteCheckItem}
          handleStateChange={handleStateChange}
          onEditCancel={handleCheckItemEditCancel}
          onEditComplete={handleCheckItemEditComplete}
          onEditInit={(): void => handleCheckItemEditInit(checkItem.id)}
        />
      ))}
    </Section>
  );
};

export default KanbanChecklist;
