import { useState } from 'react';
import styles from './CustomDatePicker.module.scss';
import { FormError } from '../../shared/components/common/Validator/FormError/FormError';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Button } from '../../shared/components/common/Button/Button';
import { registerLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import { Select } from 'shared/components/common/Select/Select';

registerLocale('ru', ru);

export type IInputProps = {
  value?: string | Date;
  valueChange: (value: string) => void;
  name: string;
  label?: string;
  description?: string;
  error?: string;
  onTouch?: () => void;
  bgColor?: 'white' | 'gray';
  disabled?: boolean;
  required?: boolean;
  minDate?: any; // YYYY-MM-DD
  maxDate?: any; // YYYY-MM-DD
};

export function CustomDatePicker({
  value = '',
  valueChange,
  name,
  label,
  description,
  error,
  onTouch,
  bgColor = 'gray',
  disabled,
  required = false,
  minDate,
  maxDate,
}: IInputProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isFocused, setIsFocusedStatus] = useState<boolean>(false);

  const maxYear = moment.utc(maxDate).year();
  const minYear = moment.utc(minDate).year();
  const years = Array(maxYear - minYear)
    .fill(null)
    .map((year, index) => ({ year: maxYear - index }));

  const months = moment.months().map((monthName, index) => ({ id: index, name: monthName }));

  const handleChange = (event) => {
    onTouch && onTouch();
    valueChange(event.target.value);
  };

  const onFocus = () => {
    setIsFocusedStatus(true);
  };

  const onBlur = () => {
    setIsFocusedStatus(false);
  };

  const className = `form-group ${isFocused ? 'focused' : ''} ${value ? 'filled' : ''} ${error ? 'error' : ''} ${
    disabled ? 'disabled' : ''
  }`;

  return (
    <div className={className}>
      <label htmlFor={name}>{label && label + (required ? ' *' : '')}</label>
      <div className={`${styles.inputContainer} ${isFocused || value ? styles.withPrefix : ''}`}>
        <DatePicker
          locale="ru"
          id={name}
          calendarStartDay={1}
          selected={value}
          onChange={(date) => {
            handleChange({ target: { value: date } });
          }}
          onFocus={onFocus}
          onBlur={onBlur}
          dateFormat="dd-MM-yyyy"
          minDate={minDate}
          maxDate={maxDate}
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className={styles.customControl}>
              <div className={`${styles.previousMonth} form-group`}>
                <Button
                  onClick={decreaseMonth}
                  icon="arrowLeft"
                  onlyIcon
                  disabled={prevMonthButtonDisabled}
                  className={styles.buttonNextPrev}
                />
              </div>
              <div className={styles.year}>
                <Select
                  label="Год"
                  options={years}
                  value={moment(date).year()}
                  idKey="year"
                  labelKey="year"
                  onSelect={(newValue) => {
                    changeYear(newValue);
                  }}
                />
              </div>

              <div className={styles.month}>
                <Select
                  label="Месяц"
                  options={months}
                  value={moment(date).month()}
                  idKey="id"
                  labelKey="name"
                  onSelect={(newValue) => {
                    changeMonth(newValue);
                  }}
                />
              </div>

              <div className={`${styles.nextMonth} form-group`}>
                <Button
                  icon="arrowRight"
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                  className={styles.buttonNextPrev}
                  onlyIcon
                />
              </div>
            </div>
          )}
        />
      </div>
      <div className="description">{error ? <FormError>{error}</FormError> : description}</div>
    </div>
  );
}
