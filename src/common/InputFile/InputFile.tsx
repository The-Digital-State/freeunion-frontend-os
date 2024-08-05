import React, { useRef } from 'react';
import styles from './InputFile.module.scss';
import { Button } from '../../shared/components/common/Button/Button';

type IInputFileProps = {
  label?: string;
  name?: string;
  description?: string;
  onChange: (file: any) => void;
  disabled?: boolean;
  children?: any;
};

export function InputFile({ name, description, label, onChange, disabled = false, children }: IInputFileProps) {
  const accept = 'image/*';

  const ref = useRef(null);

  const handleChange = (event) => {
    onChange(event.target.files);
  };

  return (
    <div className={`${styles.InputFile} form-group ${disabled ? styles.disabled : ''}`}>
      <div className={styles.formGroupFile}>
        <label htmlFor={name}>{label}вывыв</label>
        <input type="file" id={name} name={name} onChange={handleChange} accept={accept} ref={ref} />
        <div className={styles.inputFile}>&nbsp;</div>
        <div className={`${styles.btn} ${label ? '' : styles.noLabel}`}>
          {children ? (
            children
          ) : (
            <Button
              onClick={() => {
                ref.current.click();
              }}
              maxWidth
            >
              Загрузить картинку
            </Button>
          )}
        </div>
      </div>
      {description && <div className="description">{description}</div>}
    </div>
  );
}
