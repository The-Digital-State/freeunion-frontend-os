import { Slider } from 'common/Slider/Slider';
import SubscriptionCard from 'common/SubscriptionCard/SubscriptionCard';
import { PaymentCreated } from 'shared/interfaces/finance';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getSubscriptions } from 'services/finance';
import formatServerError from 'utils/formatServerError';
import { isSSR } from 'utils/isSSR';
import styles from './Subscriptions.module.scss';
import { GlobalContext } from 'contexts/GlobalContext';

const Subscriptions = ({ organisationId }: { organisationId?: number }) => {
  const { screen } = useContext(GlobalContext);
  const [subscriptions, setSubscriptions] = useState<PaymentCreated[]>();

  useEffect(() => {
    (async () => {
      try {
        const fundraisings = await getSubscriptions(+organisationId);
        setSubscriptions(fundraisings);
      } catch (e) {
        toast.error(formatServerError(e));
      }
    })();
  }, [organisationId]);

  if (!subscriptions?.length) {
    return null;
  }

  const filterSubscriptions = subscriptions.filter((i) => !!i.auto_payments?.length || !!i.manual_payments?.length);

  if (!filterSubscriptions?.length) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <h2>Пакеты подписки</h2>
      <Slider
        controlsVerticalOffset={0}
        controlsHorizontalOffset={0}
        slidesOnPage={(() => {
          if (isSSR()) {
            return 2;
          }
          const clientWidth = screen.innerWidth;
          return clientWidth > 1720 ? 3 : clientWidth > 1430 ? 2 : 1;
        })()}
        children={filterSubscriptions.map((subscription, i) => {
          return <SubscriptionCard subscription={subscription} primary={i % 2 !== 0} key={i} />;
        })}
      />
    </div>
  );
};

export default Subscriptions;
