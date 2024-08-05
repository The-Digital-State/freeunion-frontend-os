import * as Yup from 'yup';
import { Formik } from 'formik';

import { useContext, useEffect } from 'react';
import { GlobalContext } from 'contexts/GlobalContext';

import { ValidatorsTypes } from 'shared/components/common/Validator/ValidatorsTextTemplates';

import styles from './PaymentModal.module.scss';
import { TextArea } from 'shared/components/common/TextArea/TextArea';
import { Button, ButtonColors } from 'shared/components/common/Button/Button';

import ApplePayImage from './image/apple_pay.svg';
import GooglePayImage from './image/google_pay.svg';
import MastercardImage from './image/mastercard.svg';
import MastercardSecondImage from './image/maestro.svg';
import VisaImage from './image/visa.svg';
import { currencyLabel, PaymentCreated, PaymentSystems, PaymentSystemsText, PaymentTypeEnum } from 'shared/interfaces/finance';
import { Icon } from 'shared/components/common/Icon/Icon';
import { addPaymentLink } from 'services/finance';
import { toast } from 'react-toastify';
import { routes } from 'Routes';
import formatServerError from 'utils/formatServerError';
import cn from 'classnames';

const initialValues = { ammount: '' };
const initialValuesSubscription = {};

const stripeImages = [ApplePayImage, GooglePayImage, MastercardImage, MastercardSecondImage, VisaImage];

const { REACT_APP_BASE_URL } = process.env;

const PaymentModal = ({ payment }: { payment: PaymentCreated }) => {
  const isSubscription = payment?.type === PaymentTypeEnum.subscription;
  const { closeModal } = useContext(GlobalContext);

  useEffect(() => {
    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'payment',
        action: 'open_form',
      },
    });
  }, []);

  const validationSchema = Yup.object().shape({
    ammount: Yup.number()
      .typeError('Можно вводить только число')
      .min(5, `Минимальная сумма платежа 5${currencyLabel[payment.currency]}`)
      .required(ValidatorsTypes.required),
  });

  const validationSchemaSubscription = Yup.object().shape({});

  return (
    <div className={styles.wrapper}>
      <h3>Способ оплаты</h3>
      {!!payment.auto_payments?.length && (
        <Formik
          enableReinitialize
          initialValues={isSubscription ? initialValuesSubscription : initialValues}
          validationSchema={isSubscription ? validationSchemaSubscription : validationSchema}
          onSubmit={async (values) => {
            try {
              if (isSubscription) {
                const url = await addPaymentLink(
                  payment.organization.id,
                  payment.id,
                  payment.ammount,
                  `${REACT_APP_BASE_URL}${routes.PAYMENT_STATUS}?status=success`,
                  `${REACT_APP_BASE_URL}${routes.PAYMENT_STATUS}?status=cancel`
                );
                window.open(url);
                closeModal();
              } else {
                const url = await addPaymentLink(
                  payment.organization.id,
                  payment.id,
                  //@ts-ignore
                  +values.ammount,
                  `${REACT_APP_BASE_URL}${routes.PAYMENT_STATUS}?status=success`,
                  `${REACT_APP_BASE_URL}${routes.PAYMENT_STATUS}?status=cancel`
                );
                window.open(url);
                closeModal();
              }

              window.dataLayer.push({
                event: 'event',
                eventProps: {
                  category: 'payment',
                  action: 'redirect_to_payment',
                },
              });
            } catch (e) {
              toast.error(formatServerError(e));
            }
          }}
        >
          {({ errors, isSubmitting, isValid, dirty, handleSubmit, setFieldValue }) => {
            return (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className={styles.form}
              >
                <span className={styles.stripeText}>
                  Stripe - международная система для защищённых интернет-платежей с помощью пластиковых карт.
                </span>
                <div className={styles.stripeWrapper}>
                  <div className={styles.stripe}>
                    <span>Stripe</span> <Icon iconName="stripe" />
                  </div>
                  <div className={styles.stripeImages}>
                    {stripeImages.map((image, index) => {
                      return <img src={image} alt="функции оплаты через страйп" key={index} />;
                    })}
                  </div>
                </div>
                {!isSubscription && (
                  <div className={styles.ammountWrapper}>
                    <TextArea
                      placeholder="5"
                      name="ammount"
                      label={`Сумма платежа (${currencyLabel[payment.currency]})`}
                      valueChange={(value, name) => {
                        setFieldValue(name, value);
                      }}
                      rows={1}
                      //@ts-ignore
                      error={errors.ammount}
                    />
                  </div>
                )}
                <Button
                  type="submit"
                  color={ButtonColors.primary}
                  className={styles.payButton}
                  disabled={isSubscription ? false : isSubmitting || !isValid || !dirty}
                >
                  Продолжить
                </Button>
              </form>
            );
          }}
        </Formik>
      )}
      {!!payment.manual_payments && (
        <>
          {!!payment.manual_payments.length && !!payment.auto_payments?.length && (
            <span className={styles.anotherPaymentText}>Другие способы оплаты</span>
          )}
          <div className={styles.anotherPayment}>
            {payment.manual_payments.map((payment, index) => {
              let buttonLabel = '';
              if (payment.payment_system === PaymentSystems.other) {
                const domain = new URL(payment.payment_link).hostname.replace('www.', '');
                buttonLabel = domain;
              } else {
                buttonLabel = payment.payment_system;
              }
              if ([PaymentSystems.bitcoin, PaymentSystems.litecoin, PaymentSystems.ERC20].includes(payment.payment_system)) {
                return (
                  <span key={index}>
                    <b>{PaymentSystemsText[payment.payment_system]}: </b> {payment.payment_link}
                  </span>
                );
              }

              return (
                <Button
                  key={index}
                  // @ts-ignore
                  icon={payment.payment_system}
                  className={cn(styles.anotherPaymentButtons, {
                    [styles.other]: payment.payment_system === PaymentSystems.other,
                  })}
                  to={payment.payment_link}
                  target="_blank"
                >
                  {buttonLabel}
                </Button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentModal;
