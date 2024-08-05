import React, { useState } from 'react';
import styles from './Tabs.module.scss';
import { ITabItemProps } from './TabItem';

type ITabsProps = {
  children: React.ReactElement<ITabItemProps>[];
  activeTab: any;
  setActiveTab: (tab: any) => void;
  activeTabChanged?: (tab: any) => void;
  ref?: any;
};

export function Tabs({ children, activeTab: activeTabExternal, setActiveTab: setActiveTabExternal, activeTabChanged }: ITabsProps) {
  const [activeTab, setActiveTab] = useState<React.ReactElement>(
    activeTabExternal ||
      children.find((item) => {
        return item.props.active;
      }) ||
      children[0]
  );

  const onSetActiveTab = (tab) => {
    if (tab.key !== activeTab.key) {
      setActiveTabExternal(tab);
      setActiveTab(tab);
      activeTabChanged && activeTabChanged(tab);
    }
  };

  return (
    <div className={styles.Tabs}>
      <div>
        <ul>
          {children.map((child) => (
            <li
              key={child.props.label}
              className={`${activeTab.props.label === child.props.label ? styles.active : ''} ${
                child.props.disabled ? styles.disabled : ''
              }`}
              onClick={!child.props.disabled ? onSetActiveTab.bind(null, child) : undefined}
            >
              {child.props.label}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.activeTab}>
        {
          // activeTab
          children.map((child) => {
            if (child.key !== activeTab.key) return undefined;
            return child;
          })
        }
      </div>
    </div>
  );
}
