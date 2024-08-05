import { CustomImage } from 'common/CustomImage/CustomImage';
import { Slider } from 'common/Slider/Slider';
import { IUser } from 'interfaces/user.interface';
import styles from './Members.module.scss';
import { organisationsService } from 'services';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Icon } from 'shared/components/common/Icon/Icon';
import { Icons } from 'shared/components/common/Icon/Icon.interface';
import { Link } from 'react-router-dom';
import { routes } from 'Routes';
import { GlobalContext } from 'contexts/GlobalContext';
import VerificationSign from 'common/VerificationSign/VerificationSign';
import { GlobalDataContext } from 'contexts/GlobalDataContext';

interface IMembers {
  organisationId: number;
}

export const Members = ({ organisationId }: IMembers): JSX.Element => {
  const [members, setMembers] = useState<IUser[]>([]);

  const { screen } = useContext(GlobalContext);

  useEffect(() => {
    (async () => {
      try {
        const members = await organisationsService.getOrganisationMembers(organisationId, 1, 75);
        const filteredMembers = members.sort((a, b) => {
          return b.permissions - a.permissions;
        });

        setMembers(filteredMembers);
      } catch (e) {
        toast(e.code);
      }
    })();
  }, [organisationId]);

  if (!members.length) {
    return null;
  }

  return (
    <>
      <h2>Участники</h2>
      <div className={styles.card}>
        <Slider
          controlsVerticalOffset={0}
          controlsHorizontalOffset={0}
          slidesOnPage={screen.innerWidth < 1300 ? 1 : screen.innerWidth < 1700 ? 2 : 3}
          children={members.map((member) => {
            return member && <UserCard key={member.id} user={member} />;
          })}
        />
      </div>
    </>
  );
};

type IUserCardProps = {
  user: IUser;
};

function UserCard({ user }: IUserCardProps) {
  const { user: globalUser } = useContext(GlobalDataContext);
  const {
    screen: { innerWidth },
  } = useContext(GlobalContext);
  const { member_description } = user;

  return (
    <div className={styles.userCard}>
      <div className={styles.userAvatar}>
        {user.is_verified && <VerificationSign className={styles.verification} />}
        {globalUser && globalUser.id !== user.id && (
          <Link
            className={styles.chatIcon}
            to={{
              pathname: routes.chat,
              search: `id=${user.id}&type=user`,
            }}
          >
            <Icon iconName={Icons.entryChat} />
          </Link>
        )}

        <CustomImage src={user.public_avatar} alt="Avatar" width={innerWidth < 764 ? 105 : 160} height={innerWidth < 764 ? 105 : 160} />
      </div>
      <div className={styles.userInfo}>
        <h3 className={styles.userName}>
          {user.public_family} {user.public_name}
        </h3>
        <p>
          <strong>Должность:</strong> <span style={{ textTransform: 'uppercase' }}>{user.position_name || 'Участник'}</span>
        </p>

        {member_description && (
          <>
            <p>
              <strong>Описание роли:</strong> {member_description}
            </p>
          </>
        )}
        {!!user.about && <p>{user.about}</p>}

        {/* <br />
        <div className={styles.social}>
          <Icon iconName="telegram" />
          <Icon iconName="email" />
        </div> */}
      </div>
    </div>
  );
}
