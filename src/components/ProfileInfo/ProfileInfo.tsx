import { CustomImage } from 'common/CustomImage/CustomImage';
import { Icon } from 'shared/components/common/Icon/Icon';
import { Icons } from 'shared/components/common/Icon/Icon.interface';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { useContext } from 'react';
import styles from './ProfileInfo.module.scss';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { routes } from 'Routes';
import VerificationSign from 'common/VerificationSign/VerificationSign';

const ProfileInfo = ({ topBar }: { topBar?: boolean }): JSX.Element => {
  const { selectedOrganisation, user } = useContext(GlobalDataContext);
  const { public_name, public_family, public_avatar, membership, is_verified } = user;

  const { position_name: role, points: rating } = membership.find((org) => org?.id === selectedOrganisation?.id) || {};
  const isLoading = !selectedOrganisation;

  return (
    <header
      className={cn(styles.header, {
        [styles.headerTopBar]: topBar,
      })}
    >
      <Link className={styles.avatar} to={routes.EDIT_USER_PROFILE}>
        {is_verified && <VerificationSign className={styles.verificationPosition} />}
        <CustomImage src={public_avatar} alt={public_family} width={75} height={75} />
        <Icon iconName="edit" className={styles.editIcon} />
      </Link>
      <div className={styles.info}>
        <p className={styles.title}>
          {public_name} {public_family}
        </p>
        {!isLoading && (
          <>
            <p className={styles.role}>
              <span>Роль: </span>
              {`${role || 'Участник'} `}
            </p>
            <p className={styles.rating}>
              <span>Рейтинг: </span>
              {typeof rating === 'number' && (
                <>
                  <span className={styles.ratingNumber}>{rating}</span>
                  <Icon className={styles.star} iconName={Icons.star} width={14} height={14} />
                </>
              )}
            </p>
          </>
        )}
      </div>
    </header>
  );
};

export default ProfileInfo;
