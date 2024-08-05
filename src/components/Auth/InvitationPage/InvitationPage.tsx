import { CustomImage } from '../../../common/CustomImage/CustomImage';
import { Button } from '../../../shared/components/common/Button/Button';
import { useHistory } from 'react-router-dom';
import { IInviteInfo } from '../../../interfaces/user.interface';
import { routes } from 'Routes';

import styles from './InvitationPage.module.scss';

type IInvitationPageProps = {
  inviteInfo: IInviteInfo;
};

export function InvitationPage({ inviteInfo }: IInvitationPageProps) {
  const history = useHistory();

  const onSubmit = () => {
    history.push(routes.REGISTRATION + history.location.search);
  };

  const public_family = inviteInfo?.user?.public_family || '';
  const public_name = inviteInfo?.user?.public_name || '';

  return (
    <div className={`${styles.InvitationPage} p p-large`}>
      <h3>персональное приглашение </h3>
      <h3>
        {inviteInfo && (
          <>
            <strong className="text-italic text-nowrap">вас пригласил(a):</strong>
            <div className={styles.imageContainer}>
              <CustomImage rounded={true} src={inviteInfo.user?.public_avatar} height={90} width={90} alt="User Image" />
            </div>
            <div>
              <span className="text-light">{public_family + ' ' + public_name}</span>
            </div>
          </>
        )}
      </h3>
      <div className={styles.buttons}>
        <Button onClick={onSubmit}>Регистрация</Button>
        <span>или</span>
        <Button to={routes.LOGIN} color="light">
          Вход
        </Button>
      </div>
    </div>
  );
}
