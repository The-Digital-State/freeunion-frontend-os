import { Icons } from 'shared/components/common/Icon/Icon.interface';
import { ActionListItem } from './ActionListItem/ActionListItem';
import styles from './LinkList.module.scss';
import { LinkListItem } from './LinkListItem/LinkListItem';

export interface ILinkListItem {
  title: string;
  isActive: boolean;
  icon?: keyof typeof Icons;
  dataCy?: string;
  link?: string;
  action?: () => void;
}

export type ILinkListList = ILinkListItem[];

interface ILinkListProps {
  items: ILinkListList;
  startOfList?: JSX.Element;
  endOfList?: JSX.Element;
}

export function LinkList({ items, startOfList, endOfList }: ILinkListProps) {
  return (
    <ul className={styles.list}>
      {startOfList}
      {items.map(({ title, icon, link, action, isActive, dataCy }, index) => {
        if (link) {
          return <LinkListItem key={index} isActive={isActive} title={title} link={link} icon={icon} dataCy={dataCy} />;
        }
        if (action) {
          return <ActionListItem key={index} isActive={isActive} title={title} icon={icon} action={action} dataCy={dataCy} />;
        }
        return null;
      })}
      {endOfList}
    </ul>
  );
}
