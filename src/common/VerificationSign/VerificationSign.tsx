import { Icon } from 'shared/components/common/Icon/Icon';
import cn from 'classnames';
import styles from './VerificationSign.module.scss';

const confirmOgranizations = [{ name: 'Freeunion.online' }];

const VerificationSign = ({ className }: { className?: string }) => {
  return (
    <div className={cn(styles.isVerified, className)}>
      <div className={styles.tooltip}>
        <span className={styles.confirmed}>Подтверждено:</span>
        {confirmOgranizations.map((organization) => (
          <span className={styles.organizationName}>{organization.name}</span>
        ))}
      </div>
      <Icon iconName="verification"></Icon>
    </div>
  );
};

export default VerificationSign;
