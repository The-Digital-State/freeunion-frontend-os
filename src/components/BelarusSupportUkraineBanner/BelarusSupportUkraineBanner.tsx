import { Button } from 'shared/components/common/Button/Button';
import styles from './BelarusSupportUkraineBanner.module.scss';
import { routes } from 'Routes';
import cn from 'classnames';
// import { toast } from 'react-toastify';
// import { useContext } from 'react';
// import { GlobalContext } from 'contexts/GlobalContext';

const BelarusSupportUkraineBanner = ({ isTagsPage = false, tags }: { isTagsPage?: boolean; tags?: string[] }) => {
  // const {
  //   services: { deviceService },
  // } = useContext(GlobalContext);

  return (
    <div className={styles.tagsNews}>
      {!isTagsPage && <h1>Беларусы за Украину!</h1>}
      {isTagsPage && (
        <div className={styles.isTagsPageButtonsWrapper}>
          {/* {!!deviceService.isMobile && (
            <Button
              primary
              icon="link"
              className={styles.isTagsPageButton}
              onClick={() => {
                navigator.clipboard.writeText(`${window.location}`);
                toast('Ссылка скопирована в буфер обмена');
              }}
            >
              Поделиться
            </Button>
          )} */}
          <Button
            className={cn(styles.isTagsPageButton, styles.wallet)}
            onlyIcon
            icon="wallet"
            to="https://bank.gov.ua/ua/news/all/natsionalniy-bank-vidkriv-spetsrahunok-dlya-zboru-koshtiv-na-potrebi-armiyi"
            target={'_blank'}
          ></Button>

          <Button to={routes.STICKERS} className={styles.isTagsPageButton}>
            Стикеры
          </Button>
        </div>
      )}
      <div className={styles.innerContentWrapper}>
        <div className={styles.innerContent}>
          <h2 className={styles.tagNewsDescription}>
            Эта страница посвящена поддержке украинского народа беларусами и беларусскими объединениями. <br /> Мы против войны! Слава
            Украине! Жыве Беларусь!
          </h2>
          {isTagsPage ? (
            <div className={styles.tags}>
              {tags.map((tag) => {
                return (
                  <span key={tag} className={styles.tag}>
                    # {tag}
                  </span>
                );
              })}
            </div>
          ) : (
            <div className={styles.isNotTagsPageButtonsWrapper}>
              <Button to={routes.NEWS_BELARUS_FOR_UKRAINE} className={styles.isNotTagsPageButton}>
                Читать
              </Button>
              <Button to={routes.STICKERS} className={styles.isNotTagsPageButton}>
                Стикеры
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BelarusSupportUkraineBanner;
