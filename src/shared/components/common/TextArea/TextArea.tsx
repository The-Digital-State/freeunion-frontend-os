import React, { useState } from 'react';
import styles from './TextArea.module.scss';
import { FormError } from '../Validator/FormError/FormError';

type ITextAreaProps = {
  value?: string;
  valueChange: (value: string, name?: string) => void;
  name?: string;
  label?: string;
  placeholder?: string;
  description?: string;
  rows?: number;
  error?: string;
  onTouch?: () => void;
  bgColor?: 'white' | 'gray';
  disabled?: boolean;
  required?: boolean;
  dataCy?: string;
};

export function TextArea({
  dataCy,
  value = '',
  valueChange,
  name,
  label,
  placeholder,
  description,
  rows = 6,
  error,
  onTouch,
  bgColor = 'gray',
  disabled = false,
  required = false,
}: ITextAreaProps) {
  const [inputValue, setValue] = useState<string>(value);
  const [isFocused, setIsFocusedStatus] = useState<boolean>(false);

  const handleChange = (event) => {
    onTouch && onTouch();
    valueChange(event.target.value, name);
    setValue(event.target.value);
  };

  const onFocus = () => {
    setIsFocusedStatus(true);
  };

  const onBlur = () => {
    setIsFocusedStatus(false);
    onTouch && onTouch();
  };

  const className = `form-group ${inputValue ? 'filled' : ''} ${isFocused ? 'focused' : ''} ${value ? 'filled' : ''} ${error ? 'error' : ''
    } custom-scroll custom-scroll-black`;

  return (
    <div className={className}>
      <label htmlFor={name}>{label && label + (required ? ' *' : '')}</label>
      <textarea
        data-cy={dataCy}
        className={styles[bgColor]}
        id={name}
        name={name}
        rows={rows}
        placeholder={isFocused ? '' : placeholder}
        value={inputValue}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
      />
      <div className="description">{error ? <FormError>{error}</FormError> : description}</div>
    </div>
  );
}
