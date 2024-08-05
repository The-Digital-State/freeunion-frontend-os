import { NewsInterface } from '../../../shared/interfaces/news';
import { useContext, useEffect, useMemo } from 'react';

import { getNews, getNewsFilters, getOrganisationNews } from 'services/news';

import NewsGroup, { NewsGroupDirection } from '../NewsGroup/NewsGroup';
import { useSsrEffect, useSsrState } from '@issr/core';
import { GlobalContext } from 'contexts/GlobalContext';
import { belarusForUkraineTags } from 'shared/constants';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';

export enum NewsDataTypes {
  day = 'day',
  popular = 'popular',
  allNews = 'allNews',
  organisationNews = 'organisation-news',
  bestNews = 'bestNews',
  tagsNews = 'tagsNews',
  organisationNewsPage = 'organisationNewsPage',
}

const config = {
  [NewsDataTypes.popular]: {
    method: getNews,
    sort: { sortBy: 'popular' } as getNewsFilters,
    title: 'Популярное',
  },
  [NewsDataTypes.bestNews]: {
    method: getNews,
    sort: { featured: 1 } as getNewsFilters,
    title: 'Новость дня',
  },
  [NewsDataTypes.allNews]: {
    method: getNews,
    sort: {} as getNewsFilters,
    title: 'Все новости',
  },
  [NewsDataTypes.tagsNews]: {
    method: getNews,
    sort: {} as getNewsFilters,
    title: '',
  },
  [NewsDataTypes.organisationNews]: {
    method: getOrganisationNews,
    title: 'Новости',
  },
  [NewsDataTypes.organisationNewsPage]: {
    method: getOrganisationNews,
    title: 'Новости',
  },
  org: {
    method: getOrganisationNews,
    title: 'Новости',
  },
};

interface Props {
  type?: NewsDataTypes;
  organisationId?: number;
  tags?: string[];
  direction?: NewsGroupDirection;
}

const NewsGroupContainer = ({ type, organisationId, tags, direction }: Props) => {
  const {
    isMounted,
    spinner: { showSpinner, hideSpinner },
    screen,
  } = useContext(GlobalContext);

  const [news, setNews] = useSsrState<NewsInterface[]>([]);
  const [metaPageData, setMetaPageData] = useSsrState<{ last_page: number; current_page: number }>(null);

  let newsGroupDirection = useMemo(() => {
    return screen.innerWidth <= 680
      ? !!tags?.length || type === NewsDataTypes.allNews || type === NewsDataTypes.organisationNewsPage
        ? NewsGroupDirection.list
        : NewsGroupDirection.slider
      : direction;
  }, [type, organisationId, tags, direction]);

  let isListDirection = useMemo(() => {
    return (
      newsGroupDirection === NewsGroupDirection.list ||
      !!tags?.length ||
      type === NewsDataTypes.allNews ||
      type === NewsDataTypes.organisationNewsPage
    );
  }, [type, organisationId, tags, direction]);

  useEffect(() => {
    setNews([]);
    setMetaPageData(null);
  }, []);

  const loadNews = async (limit?: number) => {
    let requestedNews = [];

    if (type) {
      const { method, sort } = config[type];

      const obj = {
        ...sort,
        ...{
          organisationId,
          tags,
          limit: isListDirection ? 9 : limit,
          page: isListDirection && metaPageData?.current_page ? metaPageData.current_page + 1 : 1,
        },
      };

      !!limit && showSpinner();
      const { data, meta } = await method(obj);

      requestedNews = data;

      if (isListDirection) setMetaPageData({ current_page: meta.current_page, last_page: meta.last_page });

      hideSpinner();
    }

    setNews(!isMounted ? [] : isListDirection ? [...news, ...requestedNews] : requestedNews);
  };

  useSsrEffect(async () => {
    setNews([]);
    setMetaPageData(null);
    await loadNews(15);
    return () => {
      setNews([]);
      setMetaPageData(null);
    };
  }, type);

  useEffect(() => {
    if (isMounted) {
      (async () => {
        try {
          await loadNews(15);
        } catch (e) {
          toast.error(formatServerError(e));
        }
      })();
    }
    return () => {
      setNews([]);
      setMetaPageData(null);
    };
  }, [type, organisationId, isMounted, isListDirection, tags]);

  if (!news?.length) {
    return null;
  }

  return (
    <NewsGroup
      loadData={loadNews}
      hasMoreData={metaPageData?.current_page < metaPageData?.last_page}
      direction={newsGroupDirection}
      news={news}
      title={
        tags === belarusForUkraineTags ? '' : !!tags?.length ? `Новости по теме: ${tags?.join(',')}` : type ? config[type].title : 'Новости'
      }
      type={type === NewsDataTypes.allNews ? NewsDataTypes.popular : type}
      gridType={type}
      orgId={organisationId}
      tags={tags}
    />
  );
};

export default NewsGroupContainer;
