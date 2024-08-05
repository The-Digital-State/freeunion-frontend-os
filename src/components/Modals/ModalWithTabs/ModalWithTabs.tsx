import React, { useState } from 'react';
import styles from './ModalWithTabs.module.scss';
import { Icons } from '../../../shared/components/common/Icon/Icon.interface';
import { Icon } from '../../../shared/components/common/Icon/Icon';
import { Footer } from '../../Footer/Footer';

type ITabItem = {
  id: number;
  label: string;
  icon?: keyof typeof Icons;
  children: any;
};
type IModalWithTabsProps = {
  tabs: ITabItem[];
  activeTabId?: number;
};

export function ModalWithTabs({ tabs, activeTabId }: IModalWithTabsProps) {
  const [activeTab, setActiveTab] = useState<ITabItem>(
    tabs?.length ? (activeTabId ? tabs.find((tab) => tab.id === activeTabId) || tabs[0] : tabs[0]) : null
  );

  return (
    <div className={`${styles.ModalWithTabs}`}>
      <nav className=" p-left">
        <div className={`${styles.logo} p-top p-bottom`}>
          <Icon iconName="logoSmall" />
        </div>

        <ul className={styles.navbar}>
          {tabs.map((tab) => (
            <li
              className={tab.id === activeTab.id ? styles.active : ''}
              onClick={tab.id !== activeTab.id ? setActiveTab.bind(null, tab) : null}
              key={tab.id}
            >
              <span>{tab.label}</span>
              {tab?.icon && <Icon iconName={tab.icon} />}
            </li>
          ))}
        </ul>
      </nav>
      <div className={`${styles.content}`}>{activeTab?.children}</div>
      <Footer showLinks={false} />
    </div>
  );
}
