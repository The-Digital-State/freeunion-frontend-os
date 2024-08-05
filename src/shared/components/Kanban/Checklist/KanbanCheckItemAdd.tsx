import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Input } from 'shared/components/common/Input/Input';
import styles from './Checklist.module.scss';
import buttonStyles from 'shared/components/common/Button/Button.module.scss';
import formatServerError from 'shared/utils/formatServerError';

interface Props  {
  isExpanded: boolean;
  addCheckItem: (name: string) => void;
  setIsExpanded: (value: boolean) => void;
}
const KanbanCheckItemAdd = (props: Props) => {
  const { addCheckItem, setIsExpanded, isExpanded } = props;
  const [name, setName] = useState<string>('');

  const handleCancel = (): void => {
    setIsExpanded(false);
    setName('');
  };

  const handleChange = (value): void => {
    setName(value);
  };

  const handleSave = async (): Promise<void> => {
    try {
      if (!name) {
        return;
      }
      addCheckItem(name);
      setIsExpanded(false);
      setName('');
    } catch (err) {
      toast.error(formatServerError(err));
      console.error(err);
    }
  };

  return (
    <>
      {isExpanded ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 16,
          }}
        >
          <Input valueChange={handleChange} placeholder="Добавить пункт" value={name} className={styles.inputWrapper} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button onClick={handleCancel} className={buttonStyles.textButton}>
              Отменить
            </button>
            <button onClick={handleSave} className={buttonStyles.textButton}>
              Сохранить
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

KanbanCheckItemAdd.propTypes = {
  addCheckItem: PropTypes.func.isRequired,
};

export default KanbanCheckItemAdd;
