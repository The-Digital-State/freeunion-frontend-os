import styles from './TagsNews.module.scss';
import { Helmet } from 'react-helmet';
import BelarusSupportUkraineBanner from 'components/BelarusSupportUkraineBanner/BelarusSupportUkraineBanner';
import NewsGroupContainer, { NewsDataTypes } from 'pages/News/NewsGroupContainer/NewsGroupContainer';
import { Redirect, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { routes } from 'Routes';
import { belarusForUkraineTags } from 'shared/constants';
import { NewsGroupDirection } from 'pages/News/NewsGroup/NewsGroup';
import { SimpleRoutingContainer } from 'common/Routing/SimpleRoutingContainer/SimpleRoutingContainer';
import Navigation from 'common/Navigation/Navigation';

function TagsNews() {
  function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
  }
  const navigations = [
    {
      title: 'Все новости',
      route: routes.NEWS,
    },
    {
      title: 'Беларусы за Украину',
      route: routes.NEWS_BELARUS_FOR_UKRAINE,
    },
  ];

  const location = useLocation();
  const query = useQuery();

  let tags = useMemo(() => {
    if (location.pathname === routes.NEWS_BELARUS_FOR_UKRAINE) {
      return belarusForUkraineTags;
    } else {
      return query.get('tags')?.split(',') || [];
    }
  }, [location.pathname, query.get('tags')]);

  let belarusForUkrainePage = useMemo(() => {
    if (location.pathname === routes.NEWS_BELARUS_FOR_UKRAINE) {
      return true;
    } else {
      const urlTags = query.get('tags')?.split(',') || [];

      return urlTags.some((tag) => belarusForUkraineTags.includes(tag.toLowerCase()));
    }
  }, [location.pathname, query.get('tags')]);

  if (!tags.length) {
    return <Redirect to={routes.NEWS} />;
  }

  return (
    <SimpleRoutingContainer
      showCloseButton
      closeButtonRoute={routes.NEWS}
      // hideLogo
      // title={!belarusForUkrainePage ? `Новости по теме: ${tags.join(',')}` : 'Беларусы за Украину!'}
      logoWithText
      classNameContainer={styles.headerStyles}
    >
      <Helmet>
        <title>Новости по теме: {tags.join(',')}</title>
        <meta name="description" content={`Новости по теме: ${tags.join(',')}`} />
      </Helmet>

      <div className={styles.newsWrapper}>
        <Navigation navigations={navigations} />
        {belarusForUkrainePage && <BelarusSupportUkraineBanner tags={tags} isTagsPage={belarusForUkrainePage} />}

        {!!tags.length && (
          <NewsGroupContainer type={NewsDataTypes.tagsNews} tags={tags} direction={NewsGroupDirection.grid} key={tags.join(',')} />
        )}
      </div>
    </SimpleRoutingContainer>
  );
}
export default TagsNews;
