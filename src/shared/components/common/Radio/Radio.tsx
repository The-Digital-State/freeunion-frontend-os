import React, { ReactElement } from 'react';

import { FormError } from '../Validator/FormError/FormError';
import styles from './Radio.module.scss';

type Option = {
  label?: string;
  name?: string;
  id: string | number;
  components?: ReactElement;
};
type IRadioProps = {
  value?: number | string;
  valueChange?: (value: number | string, name?: string) => void;
  name?: string;
  label?: string;
  description?: string;
  options: Option[];
  valueKey?: string;
  labelKey?: string;
  autoFocus?: boolean;
  error?: string;
  onTouch?: () => void;
  children?: any;
  dataCy?: string;
  required?: boolean;
  className?: string;
};

export function Radio({
  options,
  value,
  valueChange,
  label = '',
  description = '',
  name,
  valueKey = 'id',
  labelKey = 'label',
  error,
  dataCy,
  onTouch,
  autoFocus,
  children,
  required = false,
  className = '',
}: IRadioProps) {
  const handleChange = (value: string | number) => {
    onTouch && onTouch();
    valueChange(value, name);
  };

  return (
    <div className={`form-group ${styles.formGroup} ${error ? styles.error : ''}`} data-cy={dataCy}>
      <label htmlFor={name}>{label + (label && required ? ' *' : '')}</label>
      <div className={`${styles.formGroupRadio} ${className} form-group__radio`}>
        {options.map((option, i) => (
          <label key={option[valueKey]}>
            <input
              type="radio"
              name={name}
              autoFocus={autoFocus && i === 0}
              value={option[valueKey]}
              onChange={handleChange.bind(this, option[valueKey])}
              checked={option[valueKey] === value}
            />
            <span data-cy={option[valueKey]} dangerouslySetInnerHTML={{ __html: option[labelKey] }} />
            {!!option?.components && option[valueKey] === value && (
              <div className={`${styles.optionElements} custom-scroll`}>{option.components}</div>
            )}
          </label>
        ))}
      </div>
      <div className="description">{error ? <FormError>{error}</FormError> : !value && description}</div>

      {children && children}
    </div>
  );
}
