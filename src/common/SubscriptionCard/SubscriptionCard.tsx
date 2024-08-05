import styles from './SubscriptionCard.module.scss';
import cn from 'classnames';
import { Button } from 'shared/components/common/Button/Button';
import { useContext } from 'react';
import { GlobalContext } from 'contexts/GlobalContext';
import PaymentModal from 'common/PaymentModal/PaymentModal';
import { currencyLabel, PaymentCreated } from 'shared/interfaces/finance';
import sanitizeHtml from 'sanitize-html';
import { allowedTagsSynitizer } from 'shared/constants/allowedTagsSynitizer';

const SubscriptionCard = ({
  subscription,
  primary,
  onClick,
}: {
  subscription: PaymentCreated;
  primary: boolean;
  onClick?: () => void;
}): JSX.Element => {
  const { openModal } = useContext(GlobalContext);

  const openPaymentModal = () => {
    if (!subscription.auto_payments?.length && subscription.manual_payments?.length === 1) {
      window.open(subscription.manual_payments[0].payment_link);
      return;
    }

    openModal({
      params: {
        mainContainer: <PaymentModal payment={subscription} />,
      },
    });
  };
  return (
    <div
      className={cn(styles.wrapper, {
        [styles.primary]: primary,
      })}
    >
      <div className={styles.titlePrice}>
        <h3>{subscription.title}</h3>
        <h2>
          {currencyLabel[subscription.currency]}
          {subscription.ammount}
        </h2>
      </div>
      <div className={styles.benefitsButton}>
        <div
          className={`${styles.benefits} custom-scroll custom-scroll-black`}
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(subscription.description, {
              allowedTags: allowedTagsSynitizer,
            }),
          }}
        ></div>
        <Button
          color={!primary ? 'primary' : 'light'}
          className={cn(styles.pay, {
            [styles.primaryButton]: primary,
          })}
          onClick={onClick || openPaymentModal}
          target="_blank"
        >
          Оплатить
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
