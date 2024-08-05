import { NewsInterface } from 'shared/interfaces/news';
import { Link, useLocation } from 'react-router-dom';
import { routes } from 'Routes';
import { format } from 'date-fns';
import ru from 'date-fns/locale/ru';
import cn from 'classnames';
import NewsOrganisationAvatar from 'common/NewsOrganisationAvatar/NewsOrganisationAvatar';
import styles from './NewsCard.module.scss';
import newsImageMock from './images/newsMock.jpg';
import { NewsDataTypes } from '../NewsGroupContainer/NewsGroupContainer';
import ItemCard from 'components/ItemCard/ItemCard';
import { useContext } from 'react';
import { GlobalContext } from 'contexts/GlobalContext';

function NewsCard({
  newsCardDetails,
  type,
  gridType,
  tags,
}: {
  newsCardDetails: NewsInterface;
  type?: NewsDataTypes;
  gridType?: NewsDataTypes;
  tags?: string[];
}) {
  const { id, title, image, organization, excerpt, published_at, commentsCount } = newsCardDetails;

  const location = useLocation();
  const {
    screen: { innerWidth },
  } = useContext(GlobalContext);

  const newsImage = image ? image : newsImageMock;

  const getFormattedData = (date: Date) => {
    return format(new Date(date), "dd MMM, yyyy 'в' HH:mm", {
      locale: ru,
    });
  };

  const getCommentsCountWord = (count: number) => {
    const lastNumber = count % 10;
    if (count === 0 || (count > 10 && count < 20)) {
      return 'комментариев';
    } else if (lastNumber > 1 && lastNumber < 5) {
      return 'комментария';
    } else if (lastNumber === 1) {
      return 'комментарий';
    }
    return 'комментариев';
  };

  const getCommentsCount = (commentsCount: number) => {
    const count = commentsCount ?? 0;
    const word = getCommentsCountWord(count % 100);
    return `${count} ${word}`;
  };

  const getCategorySearchParams = (category: NewsDataTypes): string => {
    if (!!tags?.length) {
      return '?' + new URLSearchParams({ category: category, tags: tags.join(',') }).toString();
    } else {
      return '?' + new URLSearchParams({ category: category }).toString();
    }
  };

  function getTargetRouteParams(type: NewsDataTypes) {
    return {
      pathname: routes.newsDetails.getLink(organization.id, id),
      search: getCategorySearchParams(type),
      state: {
        from: location.pathname,
      },
    };
  }

  switch (type) {
    case NewsDataTypes.popular:
      return (
        <div style={{ margin: innerWidth < 764 ? '0 10px' : '0', height: '100%' }}>
          <ItemCard
            className={styles.popularWrapper}
            innerContent={
              <div className={styles.newsMetadata}>
                <time className={styles.newsDate}>{getFormattedData(published_at)}</time>
                <time className={styles.newsComments}>{getCommentsCount(commentsCount)}</time>
              </div>
            }
            innerContentWrapperStyles={styles.innerContentWrapperPopular}
            dropDownContent={
              <div className={cn(styles.dropDownContentPopular, 'custom-scroll custom-scroll-black')}>
                <h3>{title}</h3>
                <span className={styles.descriptionSpan}>{excerpt}</span>
              </div>
            }
            organization={organization}
            targetRoute={getTargetRouteParams(gridType || NewsDataTypes.popular)}
            image={newsImage}
          />
        </div>
      );
    case NewsDataTypes.bestNews:
      return (
        <div style={{ margin: innerWidth < 764 ? '0 10px' : '0', height: '100%' }}>
          <ItemCard
            className={styles.bestNewsWrapper}
            innerContent={
              <>
                <h3>{title}</h3>
                <span className={styles.descriptionSpan}>{excerpt}</span>
                <time>{`${getFormattedData(published_at)}`}</time>
              </>
            }
            organization={organization}
            targetRoute={getTargetRouteParams(gridType || NewsDataTypes.bestNews)}
            image={newsImage}
          />
        </div>
      );
    case NewsDataTypes.allNews:
      return (
        <Link to={getTargetRouteParams(gridType || NewsDataTypes.allNews)} className={cn(styles.newsCard, styles.allNewsType)}>
          <div>
            <div className={styles.titleWrapper}>
              <NewsOrganisationAvatar organization={organization} classNames={styles.allNewsOrganization} />
              <h3>{title}</h3>
            </div>
            <div className={styles.description}>
              <span className={styles.descriptionSpan}>{excerpt}</span>
            </div>
          </div>
          <div className={styles.allNewsMetadata}>
            <time className={styles.allNewsDate}>{getFormattedData(published_at)}</time>
            <span> / </span>
            <time className={styles.allNewsComments}>{getCommentsCount(commentsCount)}</time>
          </div>
        </Link>
      );

    default:
      return (
        <div style={{ margin: innerWidth < 764 ? '0 10px' : '0', height: '100%' }}>
          <ItemCard
            innerContent={
              <>
                <h3>{title}</h3>
                <div className={styles.orgNewsMetadata}>
                  <time className={styles.orgNewsDate}>{getFormattedData(published_at)}</time>
                  <time className={styles.orgNewsComments}>{getCommentsCount(commentsCount)}</time>
                </div>
              </>
            }
            organization={organization}
            targetRoute={getTargetRouteParams(gridType || NewsDataTypes.organisationNews)}
            image={newsImage}
          />
        </div>
      );
  }
}

export default NewsCard;

export { NewsCard };
