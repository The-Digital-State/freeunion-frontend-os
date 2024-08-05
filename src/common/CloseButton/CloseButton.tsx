import { Link, useHistory } from 'react-router-dom';
import cn from 'classnames';
import { Icon } from '../../shared/components/common/Icon/Icon';

import styles from './CloseButton.module.scss';
import { routes } from 'Routes';

type ICloseButtonProps = {
  targetRoute?: any; // TODO: fix
  onClick?: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
};

export function CloseButton({ targetRoute, onClick, size = 'large', className }: ICloseButtonProps) {
  const history = useHistory();

  let width;
  let height;

  switch (size) {
    case 'large':
      width = 24;
      height = 24;
      break;
    case 'medium':
      width = 18;
      height = 18;
      break;
    default:
      width = 14;
      height = 14;
  }

  return (
    <Link
      to={targetRoute || routes.HOME}
      className={cn(styles.closeButtonHover, {
        [styles.CloseButton]: !className,
        [className]: className,
      })}
      onClick={(e) => {
        if (targetRoute) {
          return;
        }

        e.preventDefault();

        if (onClick) {
          onClick();
        } else {
          history.goBack();
        }
      }}
    >
      <Icon iconName="close" width={width} height={height} />
    </Link>
  );
}
