import { Icon } from '../Icon/Icon';
import { Icons } from '../Icon/Icon.interface';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import styles from './Button.module.scss';

export enum ButtonColors {
  primary = 'primary',
  danger = 'danger',
}

export type IButtonProps = {
  onClick?: (...params: any[]) => void;
  children?: any;
  disabled?: boolean;
  primary?: boolean; // TODO: replace to 'color' prop
  color?: ButtonColors;
  icon?: keyof typeof Icons;
  iconPosition?: 'left' | 'right' | 'center';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  to?: string;
  target?: string;
  id?: string;
  dataCy?: string;
};

export function Button({
  onClick,
  primary = false,
  color,
  dataCy,
  disabled = false,
  icon,
  iconPosition = 'right',
  children,
  target,
  type = 'button',
  className,
  to,
  ...rest
}: IButtonProps) {
  let Component: string | Link = 'button';

  let elementParams: { [key: string]: any } = {
    type,
    disabled,
  };

  if (to) {
    elementParams = {};

    if (to.includes('http')) {
      Component = 'a';
      elementParams.href = to;

      if (target) {
        elementParams.target = target;
      }

      if (target === '_blank') {
        elementParams.rel = 'noreferrer';
      }
    } else {
      // @ts-ignore
      Component = Link;
      elementParams.to = to;
    }
  }

  return (
    // @ts-ignore
    <Component
      className={cn(styles.button, className, {
        [styles.primary]: primary,
        [styles.withIcon]: icon,
        [styles.iconRigth]: iconPosition === 'right',
        [styles.iconLeft]: iconPosition === 'left',
        [styles.iconCenter]: iconPosition === 'center',
        [styles[color]]: color,
      })}
      onClick={onClick}
      data-cy={dataCy}
      {...rest}
      {...elementParams}
    >
      {children}
      {icon && <Icon iconName={icon} />}
    </Component>
  );
}
