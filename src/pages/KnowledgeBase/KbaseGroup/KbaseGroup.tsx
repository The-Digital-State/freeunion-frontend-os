import { Slider } from 'common/Slider/Slider';
import { KbaseMaterialFront, KbaseSection } from 'shared/interfaces/kbase';
import { isSSR } from 'utils/isSSR';
import { KbaseDataTypes, KbaseGroupDirection, KbaseVariety } from '../KbaseGroupContainer/KbaseGroupContainer';
import MaterialCard from '../MaterialCard/MaterialCard';
import SectionCard from '../SectionCard/SectionCard';
import styles from './KbaseGroup.module.scss';
import InfiniteScrollList from 'components/InfiniteScrollList/InfiniteScrollList';
import { useContext } from 'react';
import { GlobalContext } from 'contexts/GlobalContext';

interface PropsKbaseGroup {
  hasMoreData?: boolean;
  loadData?: () => void;
  materials?: KbaseMaterialFront[];
  sections?: KbaseSection[];
  title?: string;
  type?: KbaseDataTypes;
  direction?: KbaseGroupDirection;
  variety: KbaseVariety;
}

const KbaseGroup = ({
  loadData,
  hasMoreData,
  materials,
  variety,
  sections,
  title,
  type,
  direction = KbaseGroupDirection.slider,
}: PropsKbaseGroup) => {
  const isMaterials = variety === KbaseVariety.material && !!materials.length;
  const noDataMessage = isMaterials ? 'Статей' : 'Разделов';
  const kbaseGroupData = isMaterials ? materials : sections;
  const kbaseGroupContentChildren = isMaterials
    ? materials.map((material) => {
        return <MaterialCard key={material.id} material={material} />;
      })
    : sections.map((section) => {
        return <SectionCard key={section.id} section={section} />;
      });

  const { screen } = useContext(GlobalContext);

  const kbaseGroupContent = {
    [KbaseGroupDirection.slider]: (
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
        children={kbaseGroupContentChildren}
      />
    ),
    [KbaseGroupDirection.grid]: (
      <InfiniteScrollList
        data={kbaseGroupData}
        next={() => loadData()}
        hasMore={hasMoreData}
        listContent={<div className={styles.wrapperGrid}>{kbaseGroupContentChildren}</div>}
        endMessage={`${noDataMessage} больше нет`}
        dontFindData={`${noDataMessage} не найдено`}
      />
    ),
    [KbaseGroupDirection.list]: (
      <InfiniteScrollList
        data={kbaseGroupData}
        next={() => loadData()}
        hasMore={hasMoreData}
        listContent={<div className={styles.list}>{kbaseGroupContentChildren}</div>}
        endMessage={`${noDataMessage} больше нет`}
        dontFindData={`${noDataMessage} не найдено`}
      />
    ),
  };

  return (
    <div className={styles.wrapper}>
      {title && <h2>{title}</h2>}
      {kbaseGroupContent[direction]}
    </div>
  );
};

export default KbaseGroup;
