import { useContext, useState } from 'react';
import cn from 'classnames';
import styles from './NavigationBar.module.scss';
import { Icon } from '../../shared/components/common/Icon/Icon';
import { Icons } from '../../shared/components/common/Icon/Icon.interface';
import { CustomImage } from '../../common/CustomImage/CustomImage';
import { GlobalDataContext } from '../../contexts/GlobalDataContext';
import { UserMenu, UserMenuMode } from './UserNavigation/UserMenu/UserMenu';
import { OrganizationMenu, OrganizationMenuMode } from './OrganizationNavigation/OrganizationMenu/OrganizationMenu';
import { OrganizationContent } from './OrganizationNavigation/OrganizationContent/OrganizationContent';
import { Drawer } from 'common/Drawer/Drawer';
import { UserContent } from './UserNavigation/UserContent/UserContent';

export type MenuMode = OrganizationMenuMode | UserMenuMode;

export enum ContentMode {
  USER = 'user',
  ORGANIZATION = 'organization',
}

type INavigationBarProps = {
  isExpanded: boolean;
  setExpandedState: (state: boolean) => void;
};

export function NavigationBar({ isExpanded, setExpandedState }: INavigationBarProps) {
  const [menuMode, setMenuMode] = useState<MenuMode>(UserMenuMode.INIT);
  const [contentMode, setContentMode] = useState<ContentMode>(ContentMode.USER);

  const { selectedOrganisation, user } = useContext(GlobalDataContext);

  const isHaveMembership = !!user?.membership.length;

  const handleMouseLeave = () => {
    if (isExpanded) {
      if (contentMode === ContentMode.ORGANIZATION) {
        setMenuMode(OrganizationMenuMode.EXPANDED);
      }
      if (contentMode === ContentMode.USER) {
        setMenuMode(UserMenuMode.EXPANDED);
      }
    } else {
      setMenuMode(UserMenuMode.INIT);
    }
  };

  const showOrganizationMenu = () => {
    setMenuMode(OrganizationMenuMode.FULL);
  };

  const openUserContent = () => {
    setMenuMode(UserMenuMode.EXPANDED);
    setContentMode(ContentMode.USER);
    setExpandedState(true);
  };

  const toggleUserContent = () => (isExpanded ? closeContent() : openUserContent());

  const openOrganizationContent = () => {
    setMenuMode(OrganizationMenuMode.EXPANDED);
    setContentMode(ContentMode.ORGANIZATION);
    setExpandedState(true);
  };
  const closeContent = () => {
    setMenuMode(UserMenuMode.INIT);
    setExpandedState(false);
  };

  const toggleOrganizationContent = () =>
    isExpanded && contentMode === ContentMode.ORGANIZATION ? closeContent() : openOrganizationContent();

  const organizationContentExpanded = (mode: MenuMode) => mode === OrganizationMenuMode.EXPANDED;

  const getMenu = (mode: MenuMode): JSX.Element => {
    switch (mode) {
      case UserMenuMode.INIT:
      case UserMenuMode.EXPANDED:
        return <UserMenu mode={mode} toggleContent={toggleUserContent} />;

      case OrganizationMenuMode.FULL:
      case OrganizationMenuMode.EXPANDED:
        return <OrganizationMenu mode={mode} toggleContent={toggleOrganizationContent} />;

      default:
        return <UserMenu mode={mode} toggleContent={toggleUserContent} />;
    }
  };

  const getContent = (mode: ContentMode): JSX.Element => {
    switch (mode) {
      case ContentMode.USER:
        return <UserContent />;
      case ContentMode.ORGANIZATION:
        return <OrganizationContent />;
      default:
        return <UserContent />;
    }
  };

  return (
    <aside className={styles.NavigationBar}>
      <nav
        className={cn(styles.menu, {
          [styles.expanded]: isExpanded,
          [styles.hideToggleOrganization]: !isHaveMembership,
        })}
        onMouseLeave={handleMouseLeave}
      >
        {!isHaveMembership ? null : organizationContentExpanded(menuMode) ? (
          <button className={cn(styles.ToggleOrganization, styles.CloseOrganization)} onClick={closeContent}>
            <Icon iconName={Icons.close} />
          </button>
        ) : (
          <button className={styles.ToggleOrganization} onMouseEnter={showOrganizationMenu} onClick={openOrganizationContent}>
            <CustomImage
              src={selectedOrganisation?.avatar ?? ''}
              alt={selectedOrganisation?.name ?? ''}
              width={52}
              height={52}
              background="white"
            />
            {selectedOrganisation?.short_name ? (
              <span className={styles.ToggleOrganizationTitle}>{selectedOrganisation.short_name}</span>
            ) : null}
          </button>
        )}
        {getMenu(menuMode)}
      </nav>
      <Drawer className={styles.drawer} open={isExpanded} onClose={closeContent}>
        {getContent(contentMode)}
      </Drawer>
    </aside>
  );
}
