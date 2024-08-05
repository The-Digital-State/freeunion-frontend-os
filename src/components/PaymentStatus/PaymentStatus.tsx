import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './PaymentStatus.module.scss';
import Success from './images/success.png';
import { Button } from 'shared/components/common/Button/Button';
import { routes } from 'Routes';
import Cancel from './images/cancel.png';

enum PaymentStatusEnum {
  cancel = 'cancel',
  success = 'success',
}

const PaymentStatus = () => {
  function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
  }
  let query = useQuery();
  const status = query.get('status');

  const isSuccess = status === PaymentStatusEnum.success;

  return (
    <div className={styles.wrapper}>
      <h3>{isSuccess ? 'Оплата прошла успешно!' : 'Оплата не прошла!'}</h3>
      <img src={isSuccess ? Success : Cancel} alt={isSuccess ? 'Оплата прошла успешно' : 'Оплата не прошла'} />
      <Button to={routes.UNION}>Вернуться в сервис</Button>
    </div>
  );
};

export default PaymentStatus;
