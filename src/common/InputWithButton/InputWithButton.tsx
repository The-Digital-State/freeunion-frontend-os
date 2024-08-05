import React from 'react';
import styles from './InputWithButton.module.scss';
import { IInputProps, Input } from '../../shared/components/common/Input/Input';
import { Button, IButtonProps } from '../../shared/components/common/Button/Button';

type IInputWithButtonProps = {
  inputProps?: IInputProps;
  buttonProps?: IButtonProps;
};

export function InputWithButton({ inputProps, buttonProps }: IInputWithButtonProps) {
  return (
    <div className={styles.InputWithButton}>
      <Input
        name={inputProps.name}
        valueChange={inputProps.valueChange}
        value={inputProps.value}
        label={inputProps.label}
        description={inputProps.description}
        onTouch={inputProps.onTouch}
        error={inputProps.error}
        bgColor={inputProps.bgColor}
        disabled={inputProps.disabled}
        placeholder={inputProps.placeholder}
      />
      <div className={`form-group ${styles.formGroup}`}>
        <Button disabled={buttonProps.disabled} icon={buttonProps.icon} onClick={buttonProps.onClick}>
          {buttonProps.children}
        </Button>
      </div>
    </div>
  );
}
