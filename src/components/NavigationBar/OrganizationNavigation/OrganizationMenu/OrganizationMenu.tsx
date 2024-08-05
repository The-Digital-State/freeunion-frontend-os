import { CustomImage } from 'common/CustomImage/CustomImage';
import styles from './OrganizationMenu.module.scss';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { useContext } from 'react';
import { Icon } from '../../../../shared/components/common/Icon/Icon';
import { Icons } from 'shared/components/common/Icon/Icon.interface';
import { routes } from 'Routes';
import { Link } from 'react-router-dom';

export enum OrganizationMenuMode {
  FULL = 'organizationFull',
  EXPANDED = 'organizationExpanded',
}

interface IOrganizationMenuProps {
  toggleContent: () => void;
  mode: OrganizationMenuMode;
}

export function OrganizationMenu({ toggleContent, mode }: IOrganizationMenuProps) {
  const { user, selectedOrganisation, selectOrganisation } = useContext(GlobalDataContext);
  const unions = (user?.membership ?? []).filter((union) => union?.id !== selectedOrganisation?.id);
  const isFull = () => mode === OrganizationMenuMode.FULL;
  const isExpanded = () => mode === OrganizationMenuMode.EXPANDED;

  return (
    <div className={styles.OrganizationMenu} onClick={toggleContent}>
      <ul className={`${styles.OrganizationList} custom-scroll custom-scroll-black`}>
        {isFull()
          ? unions.map(({ avatar, name, id, short_name }) => (
              <li className={styles.OrganizationItem} key={id}>
                <Link
                  to={routes.union.getLink(id)}
                  onClick={(event) => {
                    event.stopPropagation();
                    selectOrganisation(id);
                  }}
                >
                  <CustomImage src={avatar} alt={name} width={52} height={52} background="white" />
                </Link>
                <span className={styles.Title}>{short_name}</span>
              </li>
            ))
          : null}
      </ul>
      <div className={styles.footer}>
        <p className={styles.label}>{isExpanded() ? 'Скрыть' : 'Показать'}</p>
        <p className={styles.label}>список</p>
        <div className={styles.icon}>
          <Icon iconName={isExpanded() ? Icons.arrowLeft : Icons.arrowRight} />
        </div>
      </div>
    </div>
  );
}
