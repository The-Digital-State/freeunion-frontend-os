import KanbanContainer from 'shared/components/Kanban/KanbanContainer';
import { GlobalContext } from 'contexts/GlobalContext';
import { useContext, useState } from 'react';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { Tabs } from 'shared/components/common/Tabs/Tabs';
import { TabItem } from 'shared/components/common/Tabs/TabItem';
import styles from './Tasks.module.scss';

const tabsConfig = [
  { key: 1, props: { label: 'Задачи в работе' }, type: 'all' },
  { key: 2, props: { label: 'Мои задачи' }, type: 'my' },
];

export function Kanban({ orgId }: { orgId: string }) {
  const { openModal, closeModal } = useContext(GlobalContext);
  const { user } = useContext(GlobalDataContext);
  const [activeTab, setActiveTab] = useState<any>();

  const userInOrganization = !!user?.membership.find((org) => org.id === +orgId);

  return (
    <Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
      {tabsConfig
        .filter((item) => {
          if (!user && item.type === 'my') {
            return false;
          }
          return true;
        })
        .map((tabItem) => {
          return (
            <TabItem label={tabItem.props.label} key={tabItem.key}>
              <div className={styles.container}>
                <KanbanContainer
                  isAdminApp={false}
                  openModal={openModal}
                  closeModal={closeModal}
                  getOrganizationUsers={() => {}}
                  orgId={orgId}
                  profile={user}
                  userInOrganization={userInOrganization}
                  isOnlyMyCards={Number(activeTab?.key) === tabsConfig[1].key}
                />
              </div>
            </TabItem>
          );
        })}
    </Tabs>
  );
}
