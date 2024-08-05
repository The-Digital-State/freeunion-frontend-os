import React, { useState } from 'react';
import './SelectWithButton.scss';
import { ISelectProps, Select } from 'shared/components/common/Select/Select';
import { Button, IButtonProps } from '../../shared/components/common/Button/Button';
import CSS from 'csstype';

type ISelectWithButtonProps = {
  selectProps: ISelectProps;
  buttonProps: IButtonProps;
  styles?: CSS.Properties<string | number, string & {}>;
};

export function SelectWithButton({ buttonProps, selectProps, styles }: ISelectWithButtonProps) {
  const [isSelectOptionsOpen, setSelectOptionsOpenStatus] = useState<boolean>(false);
  const [state, setState] = useState(null);

  const openStatusChanged = (status) => {
    setSelectOptionsOpenStatus(status);
  };

  return (
    <div className="SelectWithButton" style={styles}>
      <Select
        value={selectProps.value}
        options={selectProps.options}
        onSelect={(event, name) => {
          setState(event);
          selectProps.onSelect(event, name);
        }}
        labelKey={selectProps.labelKey}
        label={selectProps.label}
        multiselect={selectProps.multiselect}
        openStatusChanged={openStatusChanged}
      />
      <div className={`${isSelectOptionsOpen ? '' : 'd-none'} button-container form-group p-left p-0-left-md p-right p-0-right-md`}>
        <Button
          disabled={buttonProps.disabled}
          icon={buttonProps.icon}
          onClick={() => {
            buttonProps.onClick(state);
          }}
        >
          {buttonProps.children}
        </Button>
      </div>
    </div>
  );
}
