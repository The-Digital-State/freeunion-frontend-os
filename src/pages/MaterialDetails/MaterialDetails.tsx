import styles from '../NewsDetails/NewsDetails.module.scss';
import { useEffect, useRef, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import formatServerError from 'shared/utils/formatServerError';
import { getMaterial } from 'services/knowledge-base';
import { SimpleRoutingContainer } from 'common/Routing/SimpleRoutingContainer/SimpleRoutingContainer';
import { useSsrEffect, useSsrState } from '@issr/core';
import { routes } from 'Routes';
import { Helmet } from 'react-helmet';

import '../NewsDetails/NewsDetailsStyles.scss';
import Commento from 'components/Commento/Commento';
import Tags from 'common/Tags/Tags';
import { KbaseMaterialFront } from 'shared/interfaces/kbase';
import { toast } from 'react-toastify';
import CreaterBlock from 'common/CreaterBlock/CreaterBlock';
import PaymentModal from 'common/PaymentModal/PaymentModal';
import { GlobalContext } from 'contexts/GlobalContext';
import { getFundraisings } from 'services/finance';
import { PaymentCreated, PaymentTypeEnum } from 'shared/interfaces/finance';
import sanitizeHtml from 'sanitize-html';
import { allowedTagsSynitizer } from 'shared/constants/allowedTagsSynitizer';

type ILogo = {
  src: string;
  alt: string;
  href?: string;
};

const MaterialDetails = () => {
  const { organizationId, materialId } = useParams<{ organizationId: string; materialId: string }>();
  const [material, setMaterial] = useSsrState<KbaseMaterialFront>(undefined);
  const contentRef = useRef<HTMLDivElement>(null);
  const [logo, setLogo] = useSsrState<ILogo>(undefined);
  const [serverError, setServerError] = useSsrState(null);
  const [payments, setPayments] = useSsrState<PaymentCreated[]>([]);

  const { openModal } = useContext(GlobalContext);

  useEffect(() => {
    (async () => {
      try {
        const fundraisings = await getFundraisings(+organizationId);
        setPayments(fundraisings);
      } catch (e) {
        toast.error(formatServerError(e));
        console.log(formatServerError(e));
      }
    })();
  }, [organizationId]);

  function openFundraisingModal(choosePayment) {
    openModal({
      params: {
        mainContainer: <PaymentModal payment={choosePayment} />,
      },
    });
  }

  async function loadMaterials() {
    const response = await getMaterial(+organizationId, +materialId);
    setMaterial(response);
    setLogo({
      src: response.organization?.avatar,
      href: routes.union.getLink(organizationId),
      alt: response.organization.name,
    });
  }

  useSsrEffect(async () => {
    try {
      await loadMaterials();
    } catch (e) {
      console.log(formatServerError(e));
      setServerError(formatServerError(e));
    }
  });

  useEffect(() => {
    (async () => {
      try {
        await loadMaterials();
      } catch (e) {
        toast.error(formatServerError(e));
      }
    })();
  }, [materialId]);

  const findPayment = payments
    ?.filter((payment) => !!payment.auto_payments?.length || !!payment.manual_payments?.length)
    ?.find((payment) => payment.type === PaymentTypeEnum.fundraising);

  const areCommentsEnabled = () => {
    return material?.comments;
  };

  return (
    <SimpleRoutingContainer
      showCloseButton
      logo={logo}
      title={material?.organization?.short_name || material?.organization?.name}
      className={styles.main}
      showScrollToTopButton
    >
      {material?.id && (
        <Helmet>
          <title>{material.title}</title>
          <meta name="og:title" content={material.title} />
          <meta name="description" content={material.excerpt || material.title} />
          <meta name="og:image" content={material.image} />
        </Helmet>
      )}

      <div className={styles.wrapper}>
        {serverError && <p>{serverError}</p>}

        {material?.id && (
          <>
            <div className={styles.titleWrapper}>
              <h2 className={styles.title}>{material.title}</h2>
              <p className={styles.sectionTitle}>
                Раздел: <Link to={routes.sectionMaterials.getLink(organizationId, material.section.id)}>{material.section.name}</Link>
              </p>
            </div>
            <div className={styles.createrWrapper}>
              <CreaterBlock
                user={material.user}
                published_at={material.published_at}
                openFundraisingModal={openFundraisingModal}
                choosePayment={findPayment}
              />
            </div>
            <div className={styles.contentWrapper}>
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(material.content, {
                    allowedTags: allowedTagsSynitizer,
                    allowedAttributes: false,
                  }),
                }}
                className={styles.content}
                ref={contentRef}
              ></div>

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
              <Tags tags={material.tags} isMaterial />
            </div>
          </>
        )}
        {areCommentsEnabled() && (
          <div className={styles.contentWrapper}>
            <div className={styles.commentWrapper}>
              <Commento autoInit={true} id={`material-${organizationId}-${materialId}`} pageId={`news-${organizationId}-${materialId}`} />
            </div>
          </div>
        )}
      </div>
    </SimpleRoutingContainer>
  );
};

export default MaterialDetails;
