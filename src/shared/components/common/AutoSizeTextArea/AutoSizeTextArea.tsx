import { useState, useRef, useEffect, ClipboardEvent } from 'react';
import cn from 'classnames';
import '../TextArea/TextArea.module.scss';

type IAutoSizeTextAreaProps = {
  value?: string;
  valueChange: (value: string, name?: string) => void;
  name?: string;
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  dataCy?: string;
  className?: string;
  onPaste?: (event: ClipboardEvent) => void;
};

export function AutoSizeTextArea({
  dataCy,
  value = '',
  valueChange,
  name,
  placeholder,
  disabled = false,
  className = '',
  onPaste = () => {},
}: IAutoSizeTextAreaProps) {
  const [isFocused, setIsFocusedStatus] = useState<boolean>(false);
  const textRef = useRef<any>();

  useEffect(() => {
    if (value) {
      textRef.current.style.height = '0px';
      const scrollHeight = textRef.current.scrollHeight;
      textRef.current.style.height = scrollHeight + 'px';
      if (scrollHeight > 300) {
        textRef.current.style.overflow = 'auto';
      }
    } else {
      textRef.current.style.height = '60px';
      textRef.current.style.overflow = 'hidden';
    }
  }, [value]);

  const handleChange = (event) => {
    valueChange(event.target.value, name);
  };

  const onFocus = () => {
    setIsFocusedStatus(true);
  };

  const onBlur = () => {
    setIsFocusedStatus(false);
  };

  return (
    <textarea
      ref={textRef}
      data-cy={dataCy}
      onPaste={onPaste}
      className={cn(className, 'custom-scroll')}
      id={name}
      name={name}
      placeholder={isFocused ? '' : placeholder}
      value={value}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      onKeyUp={(ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
        }
      }}
    />
  );
}
