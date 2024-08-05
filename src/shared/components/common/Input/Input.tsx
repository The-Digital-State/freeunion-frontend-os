import React, { useEffect, useRef, useState } from 'react';
import { FormError } from '../Validator/FormError/FormError';
import { Spinner } from '../Spinner/Spinner';

import styles from './Input.module.scss';

export type IInputProps = {
  value?: string | number;
  valueChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  name?: string;
  label?: string;
  description?: string;
  error?: string;
  onTouch?: (name: string) => void;
  autocompleteOptions?: any[];
  autocompleteOptionsLabelKey?: string;
  autocompleteOnSelect?: (value: string) => void;
  autocompleteOnCancel?: () => void;
  isAutocompleteOptionsLoading?: boolean;
  bgColor?: 'white' | 'gray';
  disabled?: boolean;
  maxLength?: number;
  autoComplete?: string;
  required?: boolean;
  prefix?: string;
  placeholder?: string;
  showPassword?: boolean;
  dataCy?: string;
  withEnter?: boolean;
  onEnter?: () => void;
  className?: string;
  autoFocus?: boolean;
};

export function Input({
  value = '',
  type = 'text',
  valueChange,
  dataCy,
  name,
  label,
  description,
  autoComplete,
  error,
  onTouch,
  autocompleteOptions = null,
  autocompleteOptionsLabelKey = '',
  autocompleteOnSelect,
  autocompleteOnCancel,
  isAutocompleteOptionsLoading,
  bgColor = 'gray',
  disabled,
  required = false,
  prefix = '',
  placeholder,
  maxLength,
  showPassword: showPasswordDefaultState = false,
  withEnter = false,
  onEnter,
  autoFocus,
  className = ''
}: IInputProps) {
  const [showPassword, setShowPasswordStatus] = useState<boolean>(showPasswordDefaultState);
  const [isFocused, setIsFocusedStatus] = useState<boolean>(false);

  const handleChange = (event) => {
    // onTouch && onTouch();
    valueChange(event.target.value);
  };

  const handleAutocompleteOnSelect = (value) => {
    autocompleteOnSelect(value);
  };

  const onFocus = () => {
    setIsFocusedStatus(true);
  };

  const onBlur = () => {
    setIsFocusedStatus(false);
    onTouch && onTouch(name);
  };

  const onKeyUp = (ev) => {
    if (withEnter) {
      if (ev.keyCode === 13) {
        onEnter && onEnter();
      }
    }
  };

  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      autocompleteOnCancel && autocompleteOnCancel();
    }
  };

  useEffect(() => {
    if (autocompleteOptions?.length) {
      document.addEventListener('click', handleClickOutside, true);
      return () => {
        document.removeEventListener('click', handleClickOutside, true);
      };
    }
  }, [autocompleteOptions]);

  const wrapperClassName = `${styles.formGroup} form-group p-0 ${showPassword ? styles.openPwd : ''} ${isFocused ? 'focused' : ''
    } ${value ? 'filled' : ''} ${error ? 'error' : ''} ${disabled ? 'disabled' : ''} ${className}`;

  return (
    <div className={wrapperClassName} ref={ref}>
      <label className={styles.label} htmlFor={name}>
        {label && label + (required ? ' *' : '')}
      </label>
      <div
        className={`${styles.inputContainer} ${prefix && (isFocused || value) ? styles.withPrefix : ''} ${bgColor === 'gray' ? styles.gray : styles.white
          } ${disabled ? styles.disabled : ''}`}
      >
        {prefix && (isFocused || value) && (
          <div className={`${styles.prefix} prefix`}>
            <span>{prefix}</span>
          </div>
        )}
        <input
          id={name}
          data-cy={dataCy}
          autoComplete={autoComplete}
          name={name}
          type={showPassword ? 'text' : type}
          value={value}
          placeholder={isFocused ? '' : placeholder}
          onChange={handleChange}
          onFocus={onFocus}
          maxLength={maxLength}
          onBlur={onBlur}
          disabled={disabled}
          onKeyUp={onKeyUp}
          autoFocus={autoFocus}
        />
        {type === 'password' && (
          <div className={styles.showPwd} onClick={setShowPasswordStatus.bind(this, !showPassword)} />
        )}
        {isAutocompleteOptionsLoading && (
          <div className={styles.spinnerContainer}>
            <Spinner size={20} />
          </div>
        )}
      </div>

      <div className={`${styles.description} description`}>{error ? <FormError>{error}</FormError> : description}</div>
      {autocompleteOptions && (
        <div className={`select__options custom-scroll custom-scroll-black ${styles.selectOptions}`}>
          <div className="select__scroll">
            {autocompleteOptions?.map((option) => (
              <div
                className={`select__option`}
                onClick={handleAutocompleteOnSelect.bind(this, option[autocompleteOptionsLabelKey])}
                key={option[autocompleteOptionsLabelKey]}
              >
                {option[autocompleteOptionsLabelKey]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
