import styles from '../NewsDetails/NewsDetails.module.scss';
import pollStyles from './Poll.module.scss';
import { useEffect, useRef, useContext } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import formatServerError from 'shared/utils/formatServerError';
import { SimpleRoutingContainer } from 'common/Routing/SimpleRoutingContainer/SimpleRoutingContainer';
import { useSsrEffect, useSsrState } from '@issr/core';
import { routes } from 'Routes';
import { Helmet } from 'react-helmet';
import cn from 'classnames';

import '../NewsDetails/NewsDetailsStyles.scss';
import { toast } from 'react-toastify';
import CreaterBlock from 'common/CreaterBlock/CreaterBlock';
import PaymentModal from 'common/PaymentModal/PaymentModal';
import { GlobalContext } from 'contexts/GlobalContext';
import { getFundraisings } from 'services/finance';
import { PaymentCreated, PaymentTypeEnum } from 'shared/interfaces/finance';
import sanitizeHtml from 'sanitize-html';
import { allowedTagsSynitizer } from 'shared/constants/allowedTagsSynitizer';
import { getPoll } from 'services/polls';
import { PollFront } from 'shared/interfaces/polls';
import { Slider } from 'common/Slider/Slider';
import PollQuestions from './PollQuestions/PollQuestions';
import { EnterOrganizationStatuses, IOrganizationEnterRequest } from 'interfaces/organisation.interface';

type ILogo = {
  src: string;
  alt: string;
  href?: string;
};

const Poll = ({ closed }: { closed?: boolean }) => {
  const {
    openModal,
    services: { organisationsService },
  } = useContext(GlobalContext);
  const { organizationId, pollId } = useParams<{ organizationId: string; pollId: string }>();
  const [poll, setPoll] = useSsrState<PollFront>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [logo, setLogo] = useSsrState<ILogo>(null);
  const [serverError, setServerError] = useSsrState(null);
  const [payments, setPayments] = useSsrState<PaymentCreated[]>([]);
  const [requestStatus, setRequestStatus] = useSsrState<IOrganizationEnterRequest | null>(undefined);

  const userInOrganisation = requestStatus?.status === EnterOrganizationStatuses.active;

  const getOrganizationEnterRequest = async (id: number) => {
    try {
      const enterRequestStatus = await organisationsService.getOrganizationEnterRequestById(id);

      setRequestStatus(enterRequestStatus);
    } catch (e) {
      if (e.request.status === 404) {
        setRequestStatus(null);
        return;
      }
      toast.error(formatServerError(e));
    }
  };

  useEffect(() => {
    if (!!organizationId) {
      (async () => {
        try {
          await getOrganizationEnterRequest(+organizationId);
          const fundraisings = await getFundraisings(+organizationId);
          setPayments(fundraisings);
        } catch (e) {
          toast.error(formatServerError(e));
          console.log(formatServerError(e));
        }
      })();
    }
  }, [organizationId]);

  function openFundraisingModal(choosePayment) {
    openModal({
      params: {
        mainContainer: <PaymentModal payment={choosePayment} />,
      },
    });
  }

  async function loadPolls() {
    const response = await getPoll(+organizationId, +pollId);
    setPoll(response);
    setLogo({
      src: response.organization?.avatar,
      href: routes.union.getLink(organizationId),
      alt: response.organization.name,
    });
  }

  useSsrEffect(async () => {
    try {
      await loadPolls();
    } catch (e) {
      console.log(formatServerError(e));
      setServerError(formatServerError(e));
    }
  });

  useEffect(() => {
    if (!!userInOrganisation) {
      (async () => {
        try {
          await loadPolls();
        } catch (e) {
          toast.error(formatServerError(e));
        }
      })();
    }
  }, [pollId, userInOrganisation, requestStatus]);

  const findPayment = payments
    ?.filter((payment) => !!payment.auto_payments?.length || !!payment.manual_payments?.length)
    ?.find((payment) => payment.type === PaymentTypeEnum.fundraising);

  // const areCommentsEnabled = () => {
  //   return poll?.comments;
  // };

  if (!userInOrganisation && requestStatus !== undefined) {
    return <Redirect to={routes.UNION} />;
  }

  if (!poll || !logo) {
    return null;
  }

  return (
    <SimpleRoutingContainer
      showCloseButton
      title={poll.organization?.short_name || poll?.organization?.name}
      className={styles.main}
      showScrollToTopButton
      hideFooter
      logo={logo}
    >
      {poll?.id && (
        <Helmet>
          <title>{poll.name}</title>
          <meta name="og:title" content={poll.name} />
          <meta name="description" content={poll.description?.slice(0, 40)} />
          <meta name="og:image" content={poll.images[0]?.url} />
        </Helmet>
      )}

      <div className={styles.wrapper}>
        {serverError && <p>{serverError}</p>}

        {poll?.id && (
          <>
            <div className={styles.titleWrapper}>
              <h2 className={styles.title}>{poll.name}</h2>
              <p className={styles.sectionTitle}>Опрос</p>
            </div>
            <div className={styles.createrWrapper}>
              <CreaterBlock
                user={poll.user}
                published_at={poll.published_at}
                openFundraisingModal={openFundraisingModal}
                choosePayment={findPayment}
              />
            </div>
            <div className={cn(styles.contentWrapper, pollStyles.wrapperContent)}>
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(poll.description, {
                    allowedTags: allowedTagsSynitizer,
                    allowedAttributes: false,
                  }),
                }}
                className={styles.content}
                ref={contentRef}
              ></div>
              {!!poll.images?.length && (
                <Slider
                  slidesOnPage={1}
                  controlsVerticalOffset={0}
                  controlsHorizontalOffset={0}
                  children={poll.images.map((image) => (
                    <div className={pollStyles.imageWrapper}>
                      <img
                        src={image?.url}
                        alt={poll.name}
                        onClick={(e) =>
                          openModal({
                            params: {
                              mainContainer: <img src={image.url} alt={poll.name} />,
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                />
              )}

              {/* <div className={styles.contentBottom}>
                <div className={styles.buttons}>
                  <div className={styles.pageButtons}>
                    <NewsNavButtons next={newsContent.next} prev={newsContent.prev} category={category} />
                  </div>
                  <button className={styles.findError} onClick={openHelpOffersModal}>
                    Нашли ошибку?
                  </button>
                </div>
              </div>
               */}
              {/* <Tags tags={material.tags} isMaterial /> */}
            </div>
            {!closed ? (
              !!organizationId && !!pollId && <PollQuestions organizationId={+organizationId} pollId={+pollId} />
            ) : (
              <div className={pollStyles.wrapperCloseTitle}>
                <div className={pollStyles.questionCloseTitleWrapper}>
                  <h2>Опрос завершен</h2>
                </div>
              </div>
            )}
          </>
        )}
        {/* {areCommentsEnabled() && (
          <div className={styles.contentWrapper}>
            <div className={styles.commentWrapper}>
              <Commento autoInit={true} id={`material-${organizationId}-${materialId}`} pageId={`news-${organizationId}-${materialId}`} />
            </div>
          </div>
        )} */}
      </div>
    </SimpleRoutingContainer>
  );
};

export default Poll;
