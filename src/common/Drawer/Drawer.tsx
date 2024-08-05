import { PropsWithChildren } from 'react';
import styles from './Drawer.module.scss';
import cn from 'classnames';

interface IDrawerProps {
  open: boolean;
  onClose: () => void;
  anchor?: 'left' | 'right';
  className?: string;
}

export function Drawer({ open, anchor = 'left', className = '', onClose, children }: PropsWithChildren<IDrawerProps>) {
  const containerClassNames = cn(styles.DrawerContainer, {
    [styles.DrawerOpen]: open,
  });
  const drawerClassNames = cn(styles.Drawer, styles[anchor], className, {
    [styles.open]: open,
  });
  return (
    <div className={containerClassNames} onClick={onClose}>
      <div className={drawerClassNames}>{children}</div>
    </div>
  );
}
