import NewsGroupContainer, { NewsDataTypes } from './NewsGroupContainer/NewsGroupContainer';
import { Helmet } from 'react-helmet';
import styles from './News.module.scss';
import Navigation from 'common/Navigation/Navigation';
import { routes } from 'Routes';
import KbaseGroupContainer, { KbaseDataTypes, KbaseVariety } from 'pages/KnowledgeBase/KbaseGroupContainer/KbaseGroupContainer';
import { NewsGroupDirection } from './NewsGroup/NewsGroup';

function News() {
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
  return (
    <>
      <Helmet>
        <title>Новости</title>
        <meta name="description" content="Новости объединений" />
      </Helmet>

      <div className={styles.newsWrapper}>
        <Navigation navigations={navigations} />

        <NewsGroupContainer type={NewsDataTypes.bestNews} key={'bestNews'} />

        <NewsGroupContainer type={NewsDataTypes.popular} key={'popular'} />

        <KbaseGroupContainer variant={KbaseVariety.material} type={KbaseDataTypes.all} title="База знаний" />
        <NewsGroupContainer type={NewsDataTypes.allNews} key={'allNews'} direction={NewsGroupDirection.grid} />
      </div>
    </>
  );
}

export default News;
