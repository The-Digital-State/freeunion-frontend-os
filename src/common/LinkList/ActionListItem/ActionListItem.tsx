import styles from './ActionListItem.module.scss';
import { Icon } from 'shared/components/common/Icon/Icon';
import { ILinkListItem } from '../LinkList';

export function ActionListItem({ title, icon, action, isActive }: ILinkListItem) {
  return (
    <li className={styles.item}>
      <div className={`${styles.action} ${isActive ? '' : styles.disable}`} onClick={action}>
        {icon ? <Icon className={styles.actionIcon} iconName={icon} width={18} height={18} /> : null}
        <span className={styles.actionTitle}> {title}</span>
      </div>
    </li>
  );
}
