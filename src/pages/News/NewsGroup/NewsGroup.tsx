import { Slider } from 'common/Slider/Slider';
import { NewsInterface } from 'shared/interfaces/news';
import NewsCard from '../NewsCard/NewsCard';
import styles from './NewsGroup.module.scss';
import { NewsDataTypes } from '../NewsGroupContainer/NewsGroupContainer';
import { isSSR } from 'utils/isSSR';
import { useContext, useEffect, useRef, useState } from 'react';
import { GlobalContext } from 'contexts/GlobalContext';
import InfiniteScrollList from 'components/InfiniteScrollList/InfiniteScrollList';

export enum NewsGroupDirection {
  slider,
  grid,
  list,
}
interface Props {
  loadData: () => void;
  hasMoreData?: boolean;
  news: NewsInterface[];
  title?: string;
  type?: NewsDataTypes;
  direction?: NewsGroupDirection;
  orgId?: number;
  gridType?: NewsDataTypes;
  tags?: string[];
}
function NewsGroup({ hasMoreData, loadData, news, title, type, direction = NewsGroupDirection.slider, orgId, gridType, tags }: Props) {
  const gridRef = useRef();
  const [gridColumns, setGridColumns] = useState(isSSR() ? 4 : null);

  const { screen } = useContext(GlobalContext);

  useEffect(() => {
    if (gridRef?.current) {
      const gridColumns = window.getComputedStyle(gridRef.current).gridTemplateColumns.split(' ').length;
      setGridColumns(gridColumns);
    }
  }, [gridRef.current, screen]);

  const newsGroupContent = {
    [NewsGroupDirection.slider]: (
      <Slider
        controlsVerticalOffset={0}
        controlsHorizontalOffset={0}
        rows={type === NewsDataTypes.organisationNews ? 2 : 1}
        orgId={orgId}
        slidesOnPage={(() => {
          if (isSSR()) {
            return 2;
          }

          const clientWidth = screen.innerWidth;
          if (type === NewsDataTypes.bestNews) {
            return clientWidth > 1430 ? 2 : 1;
          }

          return clientWidth > 1720 ? 3 : clientWidth > 1430 ? 2 : 1;
        })()}
        children={news.map((newsData) => {
          return <NewsCard key={newsData.id} newsCardDetails={newsData} type={type} tags={tags} />;
        })}
      />
    ),
    [NewsGroupDirection.grid]: (
      <InfiniteScrollList
        data={news}
        next={() => loadData()}
        hasMore={hasMoreData}
        listContent={
          <div className={styles.grid} ref={gridRef}>
            {news.concat([]).map((newsData, i) => {
              if (!gridColumns) {
                // need to have ref
                return null;
              }

              enum RowType {
                picture,
                text,
              }

              let rowType: RowType = RowType.picture;
              const rowTypePictureItems = gridColumns === 4 ? 5 : gridColumns === 3 ? 3 : 0;

              let newType = type;
              let cal = i;
              // deduct amounts of item types till <0, to know what type of row is current index
              // TODO: maybe do it clever
              while (cal >= 0) {
                if (rowType === RowType.picture) {
                  if (cal === 0) {
                    newType = NewsDataTypes.popular;
                    break;
                  }
                  cal = cal - rowTypePictureItems;
                  rowType = RowType.text;
                  newType = NewsDataTypes.organisationNews;
                } else if (RowType.text) {
                  cal = cal - gridColumns;
                  rowType = RowType.picture;
                  newType = NewsDataTypes.allNews;
                }
              }

              return <NewsCard key={newsData.id} newsCardDetails={newsData} type={newType} gridType={gridType} tags={tags} />;
            })}
          </div>
        }
        endMessage="Новостей больше нет"
        dontFindData="Новостей не найдено"
      />
    ),
    [NewsGroupDirection.list]: (
      <InfiniteScrollList
        data={news}
        next={() => loadData()}
        hasMore={hasMoreData}
        listContent={
          <div className={styles.list}>
            {news.map((newsData) => {
              return <NewsCard key={newsData.id} newsCardDetails={newsData} type={type} gridType={gridType} tags={tags} />;
            })}
          </div>
        }
        endMessage="Новостей больше нет"
        dontFindData="Новостей не найдено"
      />
    ),
  };

  return (
    <div className={styles.news}>
      {title && <h2>{title}</h2>}
      <div className={styles.wrapper}>{newsGroupContent[direction]}</div>
    </div>
  );
}

export default NewsGroup;
