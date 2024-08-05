import { Button } from 'shared/components/common/Button/Button';
import { CustomImage } from 'common/CustomImage/CustomImage';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ru from 'date-fns/locale/ru';
import styles from './CreaterBlock.module.scss';
import { PaymentCreated } from 'shared/interfaces/finance';
import { UserShort } from 'shared/interfaces/user';

const CreaterBlock = ({
  user,
  published_at,
  openFundraisingModal,
  choosePayment,
}: {
  user: UserShort;
  published_at?: Date;
  openFundraisingModal?: (payment: PaymentCreated) => void;
  choosePayment?: PaymentCreated;
}): JSX.Element => {
  return (
    <div className={styles.creater}>
      <div className={styles.createrDataWrapper}>
        <div className={styles.createrData}>
          {user && <CustomImage src={user.public_avatar} alt={user.public_family + '' + user.public_name} width={52} height={52} />}

          {user && (
            <div className={styles.infoWrapper}>
              <span>{user.public_family + ' ' + user.public_name}</span>
              {!!published_at && (
                <span className={styles.data}>{`${format(new Date(published_at), "dd MMMM yyyy 'в' HH:mm", {
                  locale: ru,
                })}`}</span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.buttonWrapper}>
        {choosePayment && (
          <Button
            onlyIcon
            icon="wallet"
            className={styles.walletButton}
            onClick={() => {
              openFundraisingModal(choosePayment);
            }}
          ></Button>
        )}
        <Button
          icon="link"
          className={styles.linkButton}
          onClick={() => {
            navigator.clipboard.writeText(`${window.location}`);
            toast('Ссылка скопирована в буфер обмена');
          }}
        >
          Поделиться
        </Button>
      </div>
    </div>
  );
};

export default CreaterBlock;
