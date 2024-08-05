import { Button } from 'shared/components/common/Button/Button';

import { routes } from 'Routes';
import { NextPrevNewsButtons } from 'shared/interfaces/news';
import styles from '../NewsDetails.module.scss';

type NewsNavButtonsProps = {
  prev?: NextPrevNewsButtons;
  next?: NextPrevNewsButtons;
  category: string;
  tags?: string[];
};

export const NewsNavButtons = ({ prev, next, category, tags }: NewsNavButtonsProps) => {
  const linkToNews = (orgId, newsId) => {
    const staticLink = routes.newsDetails.getLink(orgId, newsId) + '?' + new URLSearchParams({ category: category }).toString();
    if (!!tags?.length) {
      return staticLink + '&' + new URLSearchParams({ tags: tags.join(',') });
    } else {
      return staticLink;
    }
  };
  return (
    <>
      {[prev, next].map((button, index) => {
        if (!!index && !button) {
          return (
            <Button to={routes.NEWS} className={styles.pageButton} key={index}>
              Все новости
            </Button>
          );
        }

        if (!!button) {
          return (
            <>
              <Button
                color="light"
                to={linkToNews(button.organization_id, button.id)}
                icon={!!index ? 'arrowRight' : 'arrowLeft'}
                iconPosition={!!index ? 'right' : 'left'}
                className={styles.pageButton}
                key={index}
              >
                {!!index ? 'Следующая новость' : 'Предыдущая новость'}
              </Button>
            </>
          );
        } else {
          return null;
        }
      })}
    </>
  );
};
