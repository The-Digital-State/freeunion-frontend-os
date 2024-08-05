import { CustomImage } from 'common/CustomImage/CustomImage';
import styles from './OrganizationContent.module.scss';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { useContext } from 'react';
import { Icon } from '../../../../shared/components/common/Icon/Icon';
import { Icons } from 'shared/components/common/Icon/Icon.interface';
import { ContentFooter } from 'components/NavigationBar/ContentFooter/ContentFooter';
import { Link } from 'react-router-dom';
import { routes } from 'Routes';
import cn from 'classnames';
import Tooltip from 'shared/components/common/Tooltip/Tooltip';

export function OrganizationContent() {
  const { selectedOrganisation, user, selectOrganisation } = useContext(GlobalDataContext);

  const organizationList = user?.membership.map((organization) => {
    const isSelected = selectedOrganisation?.id === organization?.id;
    return (
      <>
        <li
          className={cn(styles.OrganizationListItem, {
            [styles.selected]: isSelected,
          })}
          data-tip
          data-for={`organizaionsTooltip${organization.id}`}
        >
          <Link to={routes.union.getLink(organization.id)} onClick={() => selectOrganisation(organization.id)}>
            <div className={styles.avatar}>
              <CustomImage src={organization?.avatar} alt={organization?.name} width={56} height={56} />
            </div>
            <div className={styles.info}>
              <p className={styles.title}>{organization?.name}</p>
              <p className={styles.description}>{organization?.description}</p>
            </div>
            {isSelected && (
              <div className={styles.status}>
                <Icon iconName={Icons.tickSquare} />
              </div>
            )}
          </Link>
        </li>
        <Tooltip id={`organizaionsTooltip${organization.id}`} title={organization.name} />
      </>
    );
  });
  return (
    <>
      <div className={styles.OrganizationContentContainer}>
        <section className={styles.header}>
          <div className={styles.avatar}>
            <CustomImage src={selectedOrganisation?.avatar} alt={selectedOrganisation?.name} width={56} height={56} />
          </div>
          <div className={styles.info}>
            <p className={styles.title}>{selectedOrganisation?.name}</p>
            <p className={styles.description}>{selectedOrganisation?.description}</p>
          </div>
        </section>
        <section className={`${styles.main} custom-scroll custom-scroll-black`}>
          <ul className={styles.OrganizationList}>{organizationList}</ul>
        </section>
        <section className={styles.footer}>
          <ContentFooter />
        </section>
      </div>
    </>
  );
}
