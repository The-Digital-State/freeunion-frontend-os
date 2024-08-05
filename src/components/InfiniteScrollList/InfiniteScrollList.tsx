import InfiniteScroll from 'react-infinite-scroll-component';
import { Spinner } from 'common/Spinner/Spinner';
import styles from './InfiniteScrollList.module.scss';

type InfiniteScrollListProps = {
  listContent: JSX.Element;
  data?: any;
  dontFindData?: string;
  endMessage?: string;
  hasMore?: boolean;
  next?: () => void;
};

const InfiniteScrollList = ({ data, next, hasMore, listContent, endMessage, dontFindData }: InfiniteScrollListProps): JSX.Element => {
  return !data?.length ? (
    <h4 className={styles.dontFindData}>{dontFindData}</h4>
  ) : (
    <InfiniteScroll
      dataLength={data.length}
      next={next}
      className={styles.infinityScroll}
      hasMore={hasMore}
      loader={
        <div className={styles.spinnerWrapper}>
          <Spinner />
        </div>
      }
      endMessage={<h4 className={styles.dontFindData}>{endMessage}</h4>}
    >
      {listContent}
    </InfiniteScroll>
  );
};

export default InfiniteScrollList;
