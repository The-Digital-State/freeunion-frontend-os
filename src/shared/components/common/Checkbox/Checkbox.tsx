import { useEffect, useState } from 'react';
import cn from 'classnames';

import './Checkbox.scss';

type ICheckboxProps = {
  value?: boolean;
  valueChange: (value: boolean, event: any) => void;
  name?: string;
  title?: string;
  label?: any;
  type?: 'large' | 'small';
  error?: string;
  className?: string;
  isSquare?: boolean;
  onTouch?: () => void;
  isDark?: boolean;
};

export function Checkbox({
  value,
  isSquare = false,
  valueChange,
  label,
  name,
  error,
  onTouch,
  className,
  title,
  type = 'large',
  isDark = false
}: ICheckboxProps) {
  const [inputValue, setValue] = useState<boolean>(value);

  useEffect(() => {
    if (value !== inputValue) {
      setValue(value)
    }
  }, [value])

  const handleChange = (event) => {
    valueChange(event.target.checked, event);
    setValue(event.target.checked);
    onTouch && onTouch();
  };

  const classNames = `form-group__checkbox ${inputValue ? 'filled' : ''} ${error ? 'error' : ''} ${isSquare ? 'square' : ''
    }`;

  return (
    <div className={cn(classNames, className, type, { 'dark': isDark })}>
      {title && <h5>{title}</h5>}
      <label htmlFor={name}>
        <input
          className={value ? 'checked' : ''}
          id={name}
          name={name}
          type="checkbox"
          checked={inputValue}
          onChange={handleChange}
        />
        <span>{label}</span>
      </label>
    </div>
  );
}
