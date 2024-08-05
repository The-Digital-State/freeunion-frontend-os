import { Slider } from 'common/Slider/Slider';
import SectionCard from 'pages/KnowledgeBase/SectionCard/SectionCard';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getOrganizationMaterials, getOrganizationSections } from 'services/knowledge-base';
import { TabItem } from 'shared/components/common/Tabs/TabItem';
import { Tabs } from 'shared/components/common/Tabs/Tabs';
import formatServerError from 'utils/formatServerError';
import { isSSR } from 'utils/isSSR';
import styles from './KnowledgeBaseTabs.module.scss';
import MaterialCard from 'pages/KnowledgeBase/MaterialCard/MaterialCard';
import { KbaseMaterialFront, KbaseSection } from 'shared/interfaces/kbase';
import { GlobalContext } from 'contexts/GlobalContext';

enum KnowlegeBaseTabConfig {
  materials = 'materials',
  sections = 'sections',
}

const tabsConfig = [
  { id: 1, label: 'Материалы', type: KnowlegeBaseTabConfig.materials },
  { id: 2, label: 'Разделы', type: KnowlegeBaseTabConfig.sections },
];

const KnowledgeBaseTabs = ({ organisationId }: { organisationId?: number }) => {
  const { screen } = useContext(GlobalContext);
  const [activeTab, setActiveTab] = useState<any>();

  const [sections, setSections] = useState<KbaseSection[]>([]);
  const [materials, setMaterials] = useState<KbaseMaterialFront[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data: response } = await getOrganizationSections(organisationId);
        setSections(response.reverse());
      } catch (e) {
        toast.error(formatServerError(e));
      }
    })();
    (async () => {
      try {
        const { data: response } = await getOrganizationMaterials({
          organisationId: organisationId,
          limit: 15,
          sortBy: 'id',
          sortDirection: 'desc',
        });
        setMaterials(response);
      } catch (e) {
        toast.error(formatServerError(e));
      }
    })();
  }, [organisationId]);

  if (!materials.length && !sections.length) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <h2>База знаний</h2>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
        {tabsConfig.map((tab) => {
          return (
            <TabItem label={tab.label} key={tab.id}>
              {(() => {
                switch (tab.type) {
                  case KnowlegeBaseTabConfig.materials:
                    return (
                      !!materials.length && (
                        <div className={styles.wrapperItem}>
                          <Slider
                            controlsVerticalOffset={0}
                            controlsHorizontalOffset={0}
                            slidesOnPage={(() => {
                              if (isSSR()) {
                                return 2;
                              }
                              const clientWidth = screen.innerWidth;

                              return clientWidth > 1720 ? 3 : clientWidth > 1430 ? 2 : 1;
                            })()}
                            children={materials.map((material) => {
                              return <MaterialCard material={material} />;
                            })}
                          />
                        </div>
                      )
                    );
                  case KnowlegeBaseTabConfig.sections:
                    return (
                      !!sections.length && (
                        <div className={styles.wrapperItem}>
                          <Slider
                            controlsVerticalOffset={0}
                            controlsHorizontalOffset={0}
                            slidesOnPage={(() => {
                              if (isSSR()) {
                                return 2;
                              }
                              const clientWidth = screen.innerWidth;

                              return clientWidth > 1720 ? 3 : clientWidth > 1430 ? 2 : 1;
                            })()}
                            children={sections.map((sectionData) => {
                              return <SectionCard key={sectionData.id} section={sectionData} />;
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

export default KnowledgeBaseTabs;
