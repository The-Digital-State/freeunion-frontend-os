import React from 'react';
import styles from './ApplyToOrganization.module.scss';
import { Icons } from '../../shared/components/common/Icon/Icon.interface';
import { Icon } from '../../shared/components/common/Icon/Icon';

const items: {
  id: string;
  label: string;
  icon: keyof typeof Icons;
  complete: boolean;
  completeDate: string;
  completeLabel: string;
}[] = [
  {
    id: '1',
    label: 'Отправь заявление',
    icon: 'document',
    complete: false,
    completeDate: '15.02.2021',
    completeLabel: 'заявление отправлено',
  },
  {
    id: '2',
    label: 'Получение заявления',
    icon: null,
    complete: false,
    completeDate: '15.02.2021',
    completeLabel: 'Заявление принято',
  },
  {
    id: '3',
    label: 'Одобрение заявление',
    icon: null,
    complete: false,
    completeDate: '15.02.2021',
    completeLabel: 'Заявление одобрено',
  },
  {
    id: '4',
    label: 'Распределение в профсоюз',
    icon: null,
    complete: false,
    completeDate: '15.02.2021',
    completeLabel: 'Icon',
  },
  {
    id: '5',
    label: 'Объединись со своими',
    icon: 'group',
    complete: false,
    completeDate: null,
    completeLabel: null,
  },
];

export function ApplyToOrganization() {
  return (
    <div className={`${styles.ApplyToOrganization} bar`}>
      {items.map((item, index) => (
        <>
          <div className={styles.phase} key={item.id}>
            <div className={styles.top}>{item.complete ? item.completeDate : <Icon iconName={item.icon} />}</div>
            <div className={styles.bottom}>{item.complete ? item.completeLabel : item.label}</div>
          </div>
          {items.length - 1 !== index && <Icon iconName="arrowRight" />}
        </>
      ))}
    </div>
  );
}
