/* eslint-disable */
// TODO: delete
import { Slider } from 'common/Slider/Slider';
import ItemCard from 'components/ItemCard/ItemCard';
import styles from './Payments.module.scss';
import { format } from 'date-fns';
import ru from 'date-fns/locale/ru';
import { isSSR } from 'utils/isSSR';
import cn from 'classnames';
import { Button } from 'shared/components/common/Button/Button';
import { ApiPayments, PaymentCreated, PaymentSystems } from 'shared/interfaces/finance';
import { useContext } from 'react';
import { GlobalContext } from 'contexts/GlobalContext';
import PaymentModal from 'common/PaymentModal/PaymentModal';
import { StepsProgressBar } from 'common/StepsProgressBar/StepsProgressBar';
import { currencyLabel } from '../Finance';
import mockPaymentImage from '../mockPayment.png';
import Joining_hands from '../../../public/landing_page/joining_hands.png';

export const Payments = ({ payments }: { payments: PaymentCreated[] }) => {
  const { openModal, screen } = useContext(GlobalContext);

  const openPaymentModal = (id) => {
    const choosePayment = payments.find((payment) => payment.id === id);

    if (!choosePayment.auto_payments?.length && choosePayment.manual_payments?.length === 1) {
      window.open(choosePayment.manual_payments[0].payment_link);
      return;
    }

    openModal({
      params: {
        mainContainer: <PaymentModal payment={choosePayment} />,
      },
    });
  };

  return (
    <div className={styles.payments}>
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
        children={[
          ...payments.map((payment) => {
            const isPromotion = payment.type === 1;
            return (
              <ItemCard
                key={payment.id}
                className={styles.wrapper}
                innerContent={
                  <div className={styles.paymentTypeText}>
                    <span>{isPromotion ? 'Акция' : 'Добровольное пожертвование'}</span>
                    <time>{`${format(new Date(payment.created_at), "dd MMM, yyyy 'в' HH:mm", {
                      locale: ru,
                    })}`}</time>
                  </div>
                }
                image={payment.image || mockPaymentImage}
                dropDownContent={
                  <>
                    <div className={cn(styles.financeDropDown, 'custom-scroll custom-scroll-black')}>
                      <h3>{payment.title}</h3>
                      {isPromotion && <StepsProgressBar stepNumber={payment.collected} stepsCount={payment.ammount} />}
                      <span>{payment.description}</span>
                      {isPromotion && <span>{`Действует до ${payment.date_end}`}</span>}
                    </div>
                    <div className={styles.payButtonWrapper}>
                      <Button className={styles.payButton} onClick={() => openPaymentModal(payment.id)}>
                        Помочь
                      </Button>
                      {isPromotion && (
                        <div className={styles.paidCount}>
                          <span>Оплачено:</span>
                          <div className={styles.count}>
                            {payment.collected}
                            {currencyLabel[payment.currency]}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                }
              />
            );
          }),
          <div className={styles.helpOrganization} key={'last'}>
            <img src={Joining_hands} alt="help" />
            <h3>поддержите объединение, если вы разделяете его ценности и взгляды</h3>
          </div>,
        ]}
      />
    </div>
  );
};
