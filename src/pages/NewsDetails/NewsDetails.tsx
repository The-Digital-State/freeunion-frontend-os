import { useContext, useEffect, useMemo, useRef } from 'react';
import { routes } from 'Routes';
import { useLocation, useParams } from 'react-router-dom';
import { GlobalContext } from 'contexts/GlobalContext';
import CreaterBlock from 'common/CreaterBlock/CreaterBlock';
import { Helmet } from 'react-helmet';
import ReactDOM from 'react-dom';
import sanitizeHtml from 'sanitize-html';

import './NewsDetailsStyles.scss';

import styles from './NewsDetails.module.scss';
import { SimpleRoutingContainer } from 'common/Routing/SimpleRoutingContainer/SimpleRoutingContainer';
import NewsErrorModal from 'pages/News/NewsErrorModal/NewsErrorModal';
import { useSsrEffect, useSsrState } from '@issr/core';
import Commento from '../../components/Commento/Commento';
import { toast } from 'react-toastify';
import formatServerError from 'utils/formatServerError';
import { NewsDataTypes } from 'pages/News/NewsGroupContainer/NewsGroupContainer';
import { NewsNavButtons } from './NewsNavButtons/NewsNavButtons';
import { INewsDetails } from 'shared/interfaces/news';
import { getFundraisings } from 'services/finance';
import { PaymentCreated, PaymentTypeEnum } from 'shared/interfaces/finance';
import PaymentModal from 'common/PaymentModal/PaymentModal';
import Tags from 'common/Tags/Tags';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { belarusForUkraineTags } from 'shared/constants';
import { Button, ButtonColors } from 'shared/components/common/Button/Button';
import { Icon } from 'shared/components/common/Icon/Icon';
import { allowedTagsSynitizer } from 'shared/constants/allowedTagsSynitizer';

type ILogo = {
  src: string;
  alt: string;
  href?: string;
};

function NewsDetails() {
  const { id, orgId } = useParams<{ id: string; orgId: string }>();
  const { search, state } = useLocation<{ from?: string }>();

  function useQuery() {
    return useMemo(() => new URLSearchParams(search), [search]);
  }
  let query = useQuery();

  const category: NewsDataTypes = (query.get('category') as NewsDataTypes) || NewsDataTypes.organisationNews;

  let tags = useMemo(() => {
    return query.get('tags')?.split(',') || [];
  }, [query.get('tags')]);

  const {
    spinner: { showSpinner, hideSpinner },
    services: { organisationsService, userService },
    openModal,
  } = useContext(GlobalContext);

  const { user } = useContext(GlobalDataContext);

  const [newsContent, setNewsContent] = useSsrState<INewsDetails>(null);

  const [logo, setLogo] = useSsrState<ILogo>(undefined);
  const [payments, setPayments] = useSsrState<PaymentCreated[]>([]);
  const returnPage = useRef(null);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state?.from) {
      returnPage.current = state.from;
    }
  }, []);

  function getCloseRoute() {
    if (returnPage.current) {
      return returnPage.current;
    } else if (category === NewsDataTypes.organisationNews) {
      if (newsContent?.tags.some((tag) => belarusForUkraineTags.includes(tag))) {
        return routes.NEWS_BELARUS_FOR_UKRAINE;
      } else if (!user) {
        // not authorized
        return routes.NEWS;
      } else {
        return routes.union.getLink(orgId);
      }
    } else {
      return routes.NEWS;
    }
  }

  function openHelpOffersModal() {
    openModal({
      params: {
        mainContainer: <NewsErrorModal newsId={+id} organisationId={+orgId} />,
      },
    });
  }

  function openFundraisingModal(choosePayment) {
    openModal({
      params: {
        mainContainer: <PaymentModal payment={choosePayment} />,
      },
    });
  }

  const loadNewsDetails = async () => {
    const newsContent = (
      await organisationsService.getOrganisationOneNews({
        organisationId: +orgId,
        newsId: +id,
        sortBy:
          category === NewsDataTypes.allNews || category === NewsDataTypes.bestNews
            ? 'id'
            : category === NewsDataTypes.popular
            ? 'popular'
            : undefined,
        organization_id: category === NewsDataTypes.organisationNews ? +orgId : undefined,
        featured: category === NewsDataTypes.bestNews && 1,
        tags: tags,
      })
    ).data.data;

    setNewsContent(newsContent);
    setLogo({
      src: newsContent.organization?.avatar,
      href: routes.union.getLink(orgId),
      alt: '',
    });
  };

  const areCommentsEnabled = () => {
    return newsContent?.comments;
  };

  useEffect(() => {
    (async () => {
      try {
        const fundraisings = await getFundraisings(+orgId);
        setPayments(fundraisings);
      } catch (e) {
        toast.error(formatServerError(e));
        console.log(formatServerError(e));
      }
    })();
  }, [orgId]);

  useSsrEffect(async () => {
    try {
      if (category && id && orgId) {
        await loadNewsDetails();
      }
    } catch (error) {
      // TODO: need to think how to handle 404 server error
      console.log(error);
    }
  }, id);

  useEffect(() => {
    (async () => {
      try {
        showSpinner();
        if (category && id && orgId) {
          await loadNewsDetails();
        }
      } catch (e) {
        toast.error(formatServerError(e));
      } finally {
        hideSpinner();
      }
    })();
  }, [orgId, id, category]);

  useEffect(() => {
    const BANNER_ID = 'promo';
    if (contentRef.current && !!newsContent?.id) {
      const promo = document.createElement('div');
      promo.id = BANNER_ID;
      if (!!contentRef.current.querySelector('div') || !!userService.isLoggedIn) {
        return;
      }
      const listOfContent = contentRef.current.querySelectorAll('p');
      contentRef.current.insertBefore(promo, listOfContent[listOfContent.length - 1]);
      ReactDOM.render(<InviteBanner />, promo);
    }

    return () => {
      if (contentRef.current) {
        const promo = contentRef.current.querySelector(BANNER_ID);

        if (promo) {
          ReactDOM.unmountComponentAtNode(promo);
        }
      }
    };
  }, [contentRef.current, newsContent?.id]);

  const findPayment = payments
    ?.filter((payment) => !!payment.auto_payments?.length || !!payment.manual_payments?.length)
    ?.find((payment) => payment.type === PaymentTypeEnum.fundraising);

  return (
    <SimpleRoutingContainer
      showCloseButton
      closeButtonRoute={getCloseRoute()}
      logo={logo}
      title={newsContent?.organization?.short_name}
      className={styles.main}
      showScrollToTopButton
    >
      {newsContent && (
        <Helmet>
          <title>{newsContent.title}</title>
          <meta name="og:title" content={newsContent.title} />
          <meta name="description" content={newsContent.excerpt || newsContent.title} />
          <meta name="og:image" content={newsContent.preview} />
        </Helmet>
      )}

      <div className={styles.wrapper}>
        {newsContent && (
          <>
            <div className={styles.titleWrapper}>
              <h2 className={styles.title}>{newsContent.title}</h2>
            </div>
            <div className={styles.createrWrapper}>
              <CreaterBlock
                user={newsContent.user_id}
                published_at={newsContent.published_at}
                openFundraisingModal={openFundraisingModal}
                choosePayment={findPayment}
              />
            </div>
            <div className={styles.contentWrapper}>
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(newsContent.content, {
                    allowedTags: allowedTagsSynitizer,
                    allowedAttributes: false,
                  }),
                }}
                className={styles.content}
                ref={contentRef}
              ></div>

              <div className={styles.contentBottom}>
                <div className={styles.buttons}>
                  <div className={styles.pageButtons}>
                    <NewsNavButtons next={newsContent.next} prev={newsContent.prev} category={category} tags={tags} />
                  </div>
                  <button className={styles.findError} onClick={openHelpOffersModal}>
                    Нашли ошибку?
                  </button>
                </div>
              </div>
              <Tags tags={newsContent.tags} />
            </div>
          </>
        )}
        {areCommentsEnabled() && (
          <div className={styles.contentWrapper}>
            <div className={styles.commentWrapper}>
              <Commento autoInit={true} id={`news-${orgId}-${id}`} pageId={`news-${orgId}-${id}`} />
            </div>
          </div>
        )}
      </div>
    </SimpleRoutingContainer>
  );
}

function InviteBanner() {
  return (
    <div className={styles.inviteWrapper}>
      <div className={styles.invite}>
        <Icon iconName="logo" />
        <Button color={ButtonColors.primary} to={`${process.env.REACT_APP_BASE_URL}${routes.LOGIN}`}>
          Перейти на мою страницу
        </Button>
      </div>
    </div>
  );
}

export default NewsDetails;
