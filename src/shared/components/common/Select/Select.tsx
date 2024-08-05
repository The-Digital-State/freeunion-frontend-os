import React, { useEffect, useRef, useState } from 'react';
import './Select.scss';
import { FormError } from 'shared/components/common/Validator/FormError/FormError';
import { Icon } from 'shared/components/common/Icon/Icon';

export type ISelectProps = {
  name?: string;
  label?: string;
  description?: string;
  value?: string | number | string[] | number[];
  options: any[];
  onSelect: (event: any, name?: string) => void;
  idKey?: string;
  labelKey?: string;
  error?: string;
  onTouch?: () => void;
  multiselect?: boolean;
  required?: boolean;
  dataCy?: string;
  openStatusChanged?: (isOpen: boolean) => void;
  hasEmptyValue?: boolean;
  className?: string;
};

export function Select({
  dataCy,
  name,
  multiselect = false,
  label,
  options,
  value = multiselect ? [] : null,
  onSelect,
  description,
  idKey = 'id',
  labelKey = 'label',
  error,
  onTouch,
  required = false,
  openStatusChanged,
  hasEmptyValue = true,
  className = ''
}: ISelectProps) {
  const [isOpen, setOpenStatus] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<any>(
    multiselect
      ? options?.filter((option) => (value as string[])?.includes(option[idKey])) || []
      : options?.find((option) => option[idKey] === value) || null
  );

  useEffect(() => {
    if (multiselect) {
      if (
        (options && value && (!selectedValue || selectedValue.length) !== (value as string[]).length) ||
        (selectedValue as object[]).every((item) => (value as string[]).includes(item[idKey]))
      ) {
        setSelectedValue(options?.filter((option) => (value as string[])?.includes(option[idKey])) || []);
      }
    } else {
      if (options && value && (!selectedValue || selectedValue[idKey]) !== value) {
        setSelectedValue(options?.find((option) => option[idKey] === value) || null);
      }
    }
  }, [options, value]);

  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      onTouch && onTouch();
      setOpenStatus(false);
      openStatusChanged && openStatusChanged(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside, true);
      return () => {
        document.removeEventListener('click', handleClickOutside, true);
      };
    }
  }, [isOpen]);

  const select = (option) => {
    if (multiselect) {
      let newValue;
      const index = (selectedValue as string[])?.findIndex((item) => item[idKey] === option[idKey]);
      if (index > -1) {
        (selectedValue as string[]).splice(index, 1);
        newValue = [...(selectedValue as string[])];
      } else {
        newValue = [...(selectedValue as string[]), option];
      }
      onSelect(
        (newValue as any[]).map((item) => item[idKey]),
        name
      );
      setSelectedValue(newValue);
    } else {
      onSelect(option[idKey], name);
      setSelectedValue(option);
      setOpenStatus(false);
    }
  };

  const onToggle = () => {
    if (isOpen) {
      onTouch && onTouch();
    }
    setOpenStatus(!isOpen);
    openStatusChanged && openStatusChanged(!isOpen);
  };

  const selectedValueLength = multiselect ? (selectedValue as any[])?.length : 0;
  const selectedValueLabel = multiselect
    ? selectedValueLength === 1
      ? (selectedValue as any[])[0][labelKey]
      : selectedValueLength > 1
      ? `Выбрано ${selectedValueLength} элемент${
          selectedValueLength > 9 && selectedValueLength < 20
            ? 'ов'
            : [2, 3, 4].includes(selectedValueLength % 10)
            ? 'a'
            : selectedValueLength % 10 === 1
            ? ''
            : 'ов'
        }`
      : ''
    : (selectedValue && selectedValue[labelKey]) || '';

  return (
    <div className={`form-group ${error ? 'error' : ''} ${className}`} ref={ref}>
      <div
        className={`${isOpen ? 'opened' : ''} ${
          (multiselect ? (selectedValue as string[])?.length : selectedValue) || isOpen ? 'form-group__select' : ''
        }`}
        data-cy={dataCy}
      >
        {label && (
          <label htmlFor={name} onClick={onToggle}>
            {label + (label && required ? ' *' : '')}
          </label>
        )}
        <div className="select" onClick={onToggle}>
          <span>{selectedValueLabel}</span>
        </div>
        <div className={`select__options ${multiselect ? 'multiselect' : ''}`}>
          <div className="select__scroll custom-scroll custom-scroll-black">
            {(!multiselect && hasEmptyValue) && (
              <button
                className="select__option"
                onClick={() =>
                  select({
                    [idKey]: '',
                  })
                }
              >
                Не выбрано
              </button>
            )}
            {options?.map((option) => {
              const selected = multiselect ? (selectedValue as any[]).map((item) => item[idKey]).includes(option[idKey]) : false;
              return (
                <div
                  className={`select__option ${selected ? 'selected' : ''}`}
                  onClick={select.bind(this, option)}
                  key={option[idKey]}
                  data-cy={option.name}
                >
                  {multiselect && <div className="icon">{selected && <Icon iconName="check" width={13} height={13} color="black" />}</div>}
                  <div>{option[labelKey]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {description && (
        <div className="description">
          {error ? <FormError>{error}</FormError> : !(multiselect ? selectedValue.length : selectedValue) && description}
        </div>
      )}
    </div>
  );
}
