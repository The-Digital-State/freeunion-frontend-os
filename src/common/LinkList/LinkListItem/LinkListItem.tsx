import { Icon } from 'shared/components/common/Icon/Icon';
import { Link } from 'react-router-dom';
import { ILinkListItem } from '../LinkList';
import styles from './LinkListItem.module.scss';

export function LinkListItem({ title, icon, link, isActive, dataCy }: ILinkListItem) {
  return (
    <li className={styles.item}>
      <Link className={`${styles.link} ${isActive ? '' : styles.disable}`} to={link} data-cy={dataCy}>
        {icon ? <Icon className={styles.linkIcon} iconName={icon} width={18} height={18} /> : null}
        <span className={styles.linkTitle}>{title}</span>
      </Link>
    </li>
  );
}
