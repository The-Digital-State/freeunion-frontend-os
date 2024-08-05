import { CustomImage } from 'common/CustomImage/CustomImage';
import { SimpleRoutingContainer } from 'common/Routing/SimpleRoutingContainer/SimpleRoutingContainer';
import { GlobalContext } from 'contexts/GlobalContext';
import { IUser } from 'interfaces/user.interface';
import { useContext, useLayoutEffect, useState } from 'react';
import { IInvitedInfo } from 'services/user.service';
import styles from './Guarantee.module.scss';

const Guarantee = () => {
  const {
    services: { userService },
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);

  const [invitedInfo, setInvitedInfo] = useState<IInvitedInfo>(null);
  useLayoutEffect(() => {
    (async () => {
      try {
        showSpinner();
        const invitedInfo = await userService.getInvited();
        setInvitedInfo(invitedInfo);
      } finally {
        hideSpinner();
      }
    })();
  }, []);

  return (
    <SimpleRoutingContainer showCloseButton={true}>
      <div className={styles.wrapper}>
        <h1 id="surety">Поручительство</h1>

        {invitedInfo?.referal && (
          <>
            <h2>Меня пригласил(a):</h2>
            <UserCard user={invitedInfo.referal} />
          </>
        )}

        <h2>Мои приглашения:</h2>
        {invitedInfo?.invited.map((invited, index) => (
          <UserCard user={invited} index={index + 1} key={invited.id} />
        ))}

        {!invitedInfo?.invited?.length && <p>Приглашений нет</p>}
      </div>
    </SimpleRoutingContainer>
  );
};

function UserCard({ user, index }: { user: Partial<IUser>; index?: number }) {
  return (
    <div className={styles.user} key={user?.id}>
      <div className={styles.infoWrapper}>
        <div className={styles.avatar}>
          <CustomImage src={user?.public_avatar || ''} alt="Avatar" width={200} height={200} />
        </div>
        <div>
          <h3>
            {user?.public_family || ''} {user?.public_name || ''}
          </h3>
          <hr />

          <p>
            <strong>Предприятие: </strong> {user?.work_place || 'нет'}
          </p>

          <p>
            <strong>Должность: </strong> {user?.work_position || 'нет'}
          </p>

          {user?.about && (
            <p>
              <strong>О себе: </strong>
              {user?.about}
            </p>
          )}
        </div>
      </div>

      <div className={styles.index}>
        <h1>{index ? (index + 1).toString().padStart(2, '0') : '#'}</h1>
      </div>
    </div>
  );
}

export default Guarantee;
