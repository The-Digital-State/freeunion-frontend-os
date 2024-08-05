import { useState } from 'react';
import { Input } from 'shared/components/common/Input/Input';
import { Checkbox } from 'shared/components/common/Checkbox/Checkbox';
import styles from './Checklist.module.scss';
import buttonStyles from 'shared/components/common/Button/Button.module.scss';

const KanbanCheckItem = (props) => {
  const {
    checkItem,
    editing,
    onEditCancel,
    onEditComplete,
    onEditInit,
    handleStateChange,
    handleDeleteCheckItem,
  } = props;

  const [name, setName] = useState<string>(checkItem.name);

  const handleNameChange = (value): void => {
    setName(value);
  };

  const handleCancel = (): void => {
    setName(checkItem.name);

    if (onEditCancel) {
      onEditCancel();
    }
  };

  return (
    <div className={styles.checkItemWrapper}>
      <Checkbox
        value={checkItem.state === 1}
        valueChange={(value) => handleStateChange(value, checkItem.id)}
        isSquare
      />
      {editing ? (
        <div className={styles.checkItemEditing}>
          <Input valueChange={handleNameChange} value={name} className={styles.inputWrapper} />
          <button className={buttonStyles.textButton} onClick={() => onEditComplete({ ...checkItem, name })}>
            Сохранить
          </button>
          <button className={buttonStyles.textButton} onClick={handleCancel}>
            Отменить
          </button>
        </div>
      ) : (
        <div className={styles.content}>
          <p onClick={onEditInit}>{checkItem.name}</p>
          <button onClick={() => handleDeleteCheckItem(checkItem.id)} className={buttonStyles.textButton}>
            Удалить
          </button>
        </div>
      )}
    </div>
  );
};

export default KanbanCheckItem;
