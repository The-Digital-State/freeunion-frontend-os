import { Slider } from 'common/Slider/Slider';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { TabItem } from 'shared/components/common/Tabs/TabItem';
import { Tabs } from 'shared/components/common/Tabs/Tabs';
import formatServerError from 'utils/formatServerError';
import { isSSR } from 'utils/isSSR';
import styles from './PollsTabs.module.scss';
import { GlobalContext } from 'contexts/GlobalContext';
import PollCard from 'pages/OrganisationPolls/PollCard/PollCard';
import { getOrganisationPolls } from 'services/polls';
import { PollFront } from 'shared/interfaces/polls';

enum KnowlegeBaseTabConfig {
  activePolls = 'activePolls',
  completedPolls = 'completedPolls',
}

const PollsTabs = ({ organisationId }: { organisationId?: number }) => {
  const { screen } = useContext(GlobalContext);
  const [activeTab, setActiveTab] = useState<any>();

  const [activePolls, setActivePolls] = useState<PollFront[]>([]);
  const [completedPolls, setComlpetedPolls] = useState<PollFront[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getOrganisationPolls(organisationId);
        setActivePolls(response?.reverse());
      } catch (e) {
        toast.error(formatServerError(e));
        console.log(e);
      }
    })();
    (async () => {
      try {
        const response = await getOrganisationPolls(organisationId, 1);
        setComlpetedPolls(response);
      } catch (e) {
        toast.error(formatServerError(e));
        console.log(e);
      }
    })();
  }, [organisationId]);

  if (!activePolls?.length && !completedPolls?.length) {
    return null;
  }

  const tabsConfig = [
    !!activePolls?.length && { id: 1, label: 'Активные', type: KnowlegeBaseTabConfig.activePolls },
    !!completedPolls?.length && { id: 2, label: 'Завершенные', type: KnowlegeBaseTabConfig.completedPolls },
  ];

  return (
    <div className={styles.wrapper}>
      <h2>Опросы</h2>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
        {tabsConfig
          .filter((tab) => !!tab.id)
          .map((tab) => {
            return (
              <TabItem label={tab.label} key={tab.id}>
                {(() => {
                  switch (tab.type) {
                    case KnowlegeBaseTabConfig.activePolls:
                      return (
                        !!activePolls?.length && (
                          <div className={styles.wrapperItem}>
                            <Slider
                              controlsVerticalOffset={0}
                              controlsHorizontalOffset={0}
                              slidesOnPage={(() => {
                                if (isSSR()) {
                                  return 2;
                                }
                                const clientWidth = screen.innerWidth;

                                return clientWidth > 1720 ? 3 : clientWidth > 1230 ? 2 : 1;
                              })()}
                              children={activePolls.map((poll) => {
                                return <PollCard key={poll.id} poll={poll} organization_id={organisationId} />;
                              })}
                            />
                          </div>
                        )
                      );
                    case KnowlegeBaseTabConfig.completedPolls:
                      return (
                        !!completedPolls?.length && (
                          <div className={styles.wrapperItem}>
                            <Slider
                              controlsVerticalOffset={0}
                              controlsHorizontalOffset={0}
                              slidesOnPage={(() => {
                                if (isSSR()) {
                                  return 2;
                                }
                                const clientWidth = screen.innerWidth;

                                return clientWidth > 1720 ? 3 : clientWidth > 1230 ? 2 : 1;
                              })()}
                              children={completedPolls.map((poll) => {
                                return <PollCard key={poll.id} poll={poll} organization_id={organisationId} close />;
                              })}
                            />
                          </div>
                        )
                      );
                  }
                })()}
              </TabItem>
            );
          })}
      </Tabs>
    </div>
  );
};

export default PollsTabs;
