import React, { useContext, useEffect, useState } from 'react';
import styles from './Sidebar.module.scss';
import { Icon } from '../../shared/components/common/Icon/Icon';
import { Icons } from '../../shared/components/common/Icon/Icon.interface';
import { GlobalContext } from '../../contexts/GlobalContext';
import { Link, useHistory } from 'react-router-dom';

import { OrganisationsControl } from '../../common/OrganisationsControl/OrganisationsControl';
import { OrganisationDetails } from './OrganisationDetails/OrganisationDetails';
import { CustomImage } from '../../common/CustomImage/CustomImage';
import { GlobalDataContext } from '../../contexts/GlobalDataContext';
import { routes } from 'Routes';
import NotificationBell from 'components/notifications/NotificationBell/NotificationBell';
import ChatBell from 'components/ChatBell/ChatBell';

const { REACT_APP_ADMIN_URL } = process.env;

type ISidebarProps = {
  isExpanded: boolean;
  setExpandedState: (state: boolean) => void;
  mobileOnly?: boolean;
};

export function Sidebar({ isExpanded, setExpandedState, mobileOnly = false }: ISidebarProps) {
  const {
    applyToOrganizationIconRef,
    services: { authService, deviceService },
    spinner: { showSpinner, hideSpinner },
  } = React.useContext(GlobalContext);

  const {
    selectedOrganisation,
    selectedOrganisationId,
    selectOrganisation,
    user: { membership: organisations, administer },
    setUser,
  } = useContext(GlobalDataContext);
  const history = useHistory();

  useEffect(() => {
    // Disable scroll on mobile devises when sidebar expanded
    if (deviceService.isMobile) {
      if (isExpanded) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isExpanded]);

  const menuItems: {
    label: string;
    id?: string;
    name: keyof typeof Icons;
    route?: string;
    disabled?: boolean;
    Component?: React.FunctionComponent;
    action?: () => void;
    ref?: any;
    onlyOnMobile?: boolean;
  }[] = [
    {
      label: 'Объединение',
      route: routes.UNION,
      name: 'group',
      onlyOnMobile: true,
    },
    {
      label: 'Оповещения',
      name: 'bell',
      Component: NotificationBell,
    },
    {
      label: 'Чат',
      name: 'chatting',
      Component: ChatBell,
    },
    {
      label: 'Безопасность',
      route: '',
      name: 'security',
      action: () => {
        history.push(routes.SECURITY);
      },
    },
    {
      label: 'Редактировать',
      route: routes.EDIT_USER_PROFILE,
      name: 'briefcase',
      action: () => {
        history.push(routes.EDIT_USER_PROFILE + history.location.search);
      },
    },
    {
      label: 'Прогресс',
      route: '',
      name: 'noImage',
      ref: applyToOrganizationIconRef,
      disabled: true,
    },
    {
      label: 'Настройки',
      name: 'setting',
      route: routes.settings,
    },
    {
      label: 'Админка',
      id: 'admin',
      route: '',
      name: 'securitySafe',
      action: () => {
        window.dataLayer.push({
          event: 'event',
          eventProps: {
            category: 'user',
            action: 'click',
            label: 'Admin dashboard button',
          },
        });
        window.open(`${REACT_APP_ADMIN_URL}/${selectedOrganisationId}/union`, 'freeunion-admin');
      },
    },
    {
      label: 'Выход',
      route: '',
      name: 'out',
      action: async () => {
        try {
          showSpinner();
          await authService.logout();
          history.push(routes.LOGIN);
          setUser(null);
          window.location.reload();
        } catch (e) {
        } finally {
          hideSpinner();
        }
      },
    },
  ];
  const [contentMode, setContentMode] = useState<'initial' | 'organisationsMode'>('initial');
  const [showOrganisationsNames, setShowOrganisationsNamesStatus] = useState<boolean>(true);
  const handleOpenClose = () => {
    if (isExpanded) {
      if (contentMode === 'organisationsMode') {
        setContentMode('initial');
      } else {
        setExpandedState(!isExpanded);
      }
    } else {
      setExpandedState(!isExpanded);
    }
  };

  const onOpenSidebarWithOrganisations = () => {
    setExpandedState(true);
    setContentMode('organisationsMode');
  };

  const handleClickIcon = (menuItem) => {
    const { action, route } = menuItem;

    if (action) {
      action();
    }
    if (route) {
      if (history.location.pathname !== route) {
        history.push(route);
      }
    }
    if (isExpanded) {
      setExpandedState(!isExpanded);
    }
  };

  // Work with swiping
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);
  const minDistance = 75;

  const checkSwipeDirection = () => {
    if (touchStart - touchEnd > minDistance) {
      if (contentMode === 'initial') {
        setContentMode('organisationsMode');
      }
      setShowOrganisationsNamesStatus(false);
    }

    if (touchStart - touchEnd < -minDistance) {
      setShowOrganisationsNamesStatus(true);
    }
  };

  useEffect(() => {
    checkSwipeDirection();
  }, [touchEnd]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientX);
  };

  const handleSelectingOrganisation = async (organisationId: number) => {
    selectOrganisation(organisationId);
    history.push(routes.union.getLink(organisationId));

    if (deviceService.isMobile) {
      setExpandedState(false);
      setContentMode('initial');
    }
  };

  const printIcons = () => {
    return menuItems
      .filter((item) => (!item.disabled && deviceService.isMobile ? true : !item.onlyOnMobile))
      .map((item) => {
        if (item.id === 'admin' && !administer.length) {
          return null;
        }

        return (
          <div
            className={`${styles.menuItem} ${item.disabled ? styles.hidden : ''}`}
            key={item.name}
            ref={item.ref}
            onClick={handleClickIcon.bind(null, item)}
          >
            {item.Component ? <item.Component /> : <Icon iconName={item.name} key={item.name} color={item.disabled ? 'disabled' : null} />}
            <div className={`${styles.label} text-uppercase text-bold`}>{item.label}</div>
          </div>
        );
      });
  };

  const printPagesList = () => {
    // const pagesList: { id: string; label: string; path: Routes }[] = [
    // {
    //   id: '1',
    //   label: 'профиль',
    //   path: routes.PROFILE
    // },
    // {
    //   id: '2',
    //   label: '',
    //   path: null
    // },
    // {
    //   id: '3',
    //   label: 'безопасность',
    //   path: routes.SECURITY
    // },
    // {
    //   id: '4',
    //   label: 'пользовательское соглашение',
    //   path: routes.RULES_SERVICE
    // },
    // {
    //   id: '5',
    //   label: 'политика конфиденциальности',
    //   path: routes.PRIVACY_POLICY
    // }
    // ];

    // const navigate = (path: Routes, e) => {
    //   e.preventDefault();
    //   history.push(path + history.location.search);
    //   setExpandedState(false);
    // };

    const links = [
      {
        text: 'Создать объединение',
        link: routes.CREATE_UNION,
      },
      {
        text: 'Все объединения',
        link: routes.UNIONS,
      },
      { text: 'Все новости', link: routes.NEWS },
      { text: 'База знаний', link: routes.KNOWLEDGE_BASE_MATERIALS },
      {
        text: 'Помощь нашей команде!',
        link: routes.SUPPORT_US,
      },
      { text: 'Контакты', link: routes.CONTACT_US },
    ];
    return (
      <ul className="no-style text-nowrap text-uppercase p-0">
        {/*{pagesList.map((page) =>*/}
        {/*  page.path ? (*/}
        {/*    <li key={page.id} className={page.path === history.location.pathname ? styles.active : ''}>*/}
        {/*      <a onClick={navigate.bind(null, page.path)}>{page.label}</a>*/}
        {/*      /!*<Link to={page.path + history.location.search}></Link>*!/*/}
        {/*    </li>*/}
        {/*  ) : (*/}
        {/*    <br key={page.id}/>*/}
        {/*  )*/}
        {/*)}*/}

        {links.map(({ text, link }, i) => {
          if (!link) {
            return null; // TODO: fix, temp
          }

          return (
            <li key={i}>
              <Link to={link} onClick={handleOpenClose}>
                {text}
              </Link>
            </li>
          );
        })}

        {/* <li className="disabled">О нас</li> */}
        {/* <li>структура</li> */}
        {/* <li>Взносы</li> */}
        {/* <li>новости</li> */}
        {/* <li>финансы</li> */}
        {/* <li>архив</li> */}
        {/* <li>FAQ</li> */}
      </ul>
    );
  };

  const printOrganisations = () => {
    return (
      <>
        <div className={styles.avatarsList}>
          {organisations.map((organisation) => {
            return (
              <div
                key={organisation.id + 'avatar'}
                className={styles.organisationAvatar}
                onClick={handleSelectingOrganisation.bind(null, organisation.id)}
              >
                <CustomImage
                  src={organisation?.avatar}
                  alt={organisation?.short_name}
                  width={52}
                  height={52}
                  background="gray"
                  errorImage="noImage"
                />
              </div>
            );
          })}
        </div>
        <div className={styles.organisationTitlesList}>
          {organisations.map((organisation) => {
            return (
              <div
                className={styles.organisationTitle}
                onClick={handleSelectingOrganisation.bind(null, organisation.id)}
                key={organisation.id + 'title'}
              >
                {organisation.short_name}
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const printMenuTitles = () => {
    return (
      <>
        <div key="close_title" onClick={handleOpenClose}>
          Закрыть
        </div>
        {menuItems
          .filter((item) => !item.disabled)
          .map((item, index) => (
            <div key={`${item.name}_title_${index}`} onClick={handleClickIcon.bind(null, item)}>
              {item.label}
            </div>
          ))}
      </>
    );
  };

  let content;
  switch (contentMode) {
    case 'initial': {
      content = deviceService.isMobile ? (
        <div className={`${styles.mobileContent} ${styles.initial}`}>
          <div className={styles.leftContainer}>
            <OrganisationsControl orientation="horizontal" onClick={onOpenSidebarWithOrganisations} bgColor="gray" />
            <div className={styles.pages}>{printPagesList()}</div>
          </div>

          <div className={styles.rightContainer}>
            <div className={styles.menuItemsTitlesList}>{printMenuTitles()}</div>
          </div>
        </div>
      ) : (
        <div className={styles.desktopContent}>
          <div className={styles.pages}>{printPagesList()}</div>
          <OrganisationDetails organisation={selectedOrganisation} showAllData={false} />
        </div>
      );
      break;
    }
    case 'organisationsMode':
      content = deviceService.isMobile ? (
        <div
          className={`${styles.mobileContent} ${styles.organisationsMode} ${
            showOrganisationsNames ? styles.showOrganisationsNames : styles.showMenuTitles
          }`}
        >
          <div className={styles.leftContainer}>{printOrganisations()}</div>

          <div className={styles.rightContainer}>
            <div className={styles.menuItemsTitlesList}>{printMenuTitles()}</div>
          </div>
        </div>
      ) : (
        <div className={styles.desktopContent}>
          <OrganisationDetails organisation={selectedOrganisation} />
        </div>
      );
      break;
  }

  return (
    <div
      className={`${styles.SidebarContainer} ${isExpanded ? styles.expanded : ''} ${mobileOnly ? styles.mobileOnly : ''} ${
        deviceService.isMobile ? styles.mobileMode : ''
      }`}
    >
      <aside
        className={styles.Sidebar}
        onTouchStart={deviceService.isMobile ? handleTouchStart : undefined}
        onTouchMove={deviceService.isMobile ? handleTouchMove : undefined}
        onTouchEnd={deviceService.isMobile ? handleTouchEnd : undefined}
      >
        <div className={`${styles.content} p-left-lg p-top-lg p-bottom-lg`}>{content}</div>

        <div className={`${styles.main} p-bottom`}>
          <div className={styles.menu}>
            <div className={`${styles.menuItem}`} onClick={handleOpenClose}>
              <Icon iconName={isExpanded ? 'close' : 'menu'} />
            </div>
            {(contentMode === 'initial' || deviceService.isMobile) && printIcons()}
          </div>
          {!deviceService.isMobile && (
            <div className={styles.organisationsControl}>
              <OrganisationsControl onClick={onOpenSidebarWithOrganisations} compactMode={contentMode !== 'organisationsMode'} />
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
