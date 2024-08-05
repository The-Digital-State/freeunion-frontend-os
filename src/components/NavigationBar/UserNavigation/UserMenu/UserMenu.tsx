import styles from './UserMenu.module.scss';
import { isEmpty } from 'lodash';
import { Icon } from 'shared/components/common/Icon/Icon';
import { ReactNode, useContext } from 'react';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { GlobalContext } from 'contexts/GlobalContext';
import { NavLink } from 'react-router-dom';
import { Icons } from 'shared/components/common/Icon/Icon.interface';
import { routes } from 'Routes';

export enum UserMenuMode {
  INIT = 'userInit',
  EXPANDED = 'userExpanded',
}

export interface IUserMenuModelItem {
  title: string;
  isActive: boolean;
  dataCy?: string;
  id?: string;
  icon?: keyof typeof Icons;
  link?: string;
  action?: () => void;
  Component?: React.FunctionComponent;
}

export type IUserMenuModel = IUserMenuModelItem[];

interface IUserMenuProps {
  mode: UserMenuMode;
  toggleContent: () => void;
}

export function UserMenu({ mode, toggleContent }: IUserMenuProps) {
  const globalDataContext = useContext(GlobalDataContext);
  const { selectedOrganisation } = globalDataContext;
  const {
    services: { navigationBuilder },
  } = useContext(GlobalContext);

  const menuItems = navigationBuilder.getUserMenuStructure(globalDataContext);

  const isExpanded = () => mode === UserMenuMode.EXPANDED;
  const isNotAdmin = () => isEmpty(globalDataContext?.user?.administer);
  const isAdminSelectedOrganization = globalDataContext?.user?.administer?.find(
    (org) => org.id === globalDataContext?.selectedOrganisationId
  );

  // const isHaveMembership = globalDataContext?.user?.membership.length;

  const handleClickOnMenuItem = () => isExpanded() && toggleContent();

  const createMenu = (menuItems: IUserMenuModel) => {
    return menuItems.map(({ title, icon, link, Component, action, isActive, id, dataCy }, index) => {
      if (id === 'admin' && (isNotAdmin() || !isAdminSelectedOrganization?.id)) {
        return null;
      } else if (id === 'news-suggest') {
        if (!selectedOrganisation?.id) {
          return null;
        }
        // else if (id === 'union' && !isHaveMembership) {
        //      return null;
        //    }

        link = routes.newsSuggest.getLink(selectedOrganisation.id);
      }
      if (Component) {
        return (
          <div
            key={index}
            className={`${styles.MenuItem} ${isActive ? '' : styles.disable}`}
            data-cy={dataCy}
            onClick={handleClickOnMenuItem}
          >
            <Component />
            <span className={styles.Title}>{title}</span>
          </div>
        );
      }
      if (link) {
        return (
          <NavLink
            activeClassName={styles.ActiveLink}
            key={index}
            data-cy={dataCy}
            className={`${styles.MenuItem} ${isActive ? '' : styles.disable}`}
            to={link}
            onClick={handleClickOnMenuItem}
          >
            <Icon className={styles.Icon} iconName={icon} width={28} height={28} />
            <span className={styles.Title}>{title}</span>
          </NavLink>
        );
      }
      if (action) {
        return (
          <div
            key={index}
            data-cy={dataCy}
            className={`${styles.MenuItem} ${isActive ? '' : styles.disable}`}
            onClick={() => {
              handleClickOnMenuItem();
              action();
            }}
          >
            <Icon className={styles.Icon} iconName={icon} width={28} height={28} />
            <span className={styles.Title}>{title}</span>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className={styles.UserMenu}>
      <div className={`${styles.Burger}`} data-cy="burger-menu" onClick={toggleContent}>
        {isExpanded() ? <Icon iconName={Icons.close} /> : <Icon iconName={Icons.burger} width={32} height={32} />}
      </div>
      <div className={`${styles.MenuItems}  custom-scroll custom-scroll-black`}>{createMenu(menuItems) as ReactNode[]}</div>
    </div>
  );
}
