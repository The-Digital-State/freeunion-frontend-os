import { Icons } from 'shared/components/common/Icon/Icon.interface';
import { ILinkListList } from 'common/LinkList/LinkList';
import { IGlobalDataState } from 'contexts/GlobalDataContext';
import { routes } from 'Routes';
import NotificationBell from 'components/notifications/NotificationBell/NotificationBell';
import { IUserMenuModel } from 'components/NavigationBar/UserNavigation/UserMenu/UserMenu';
import ChatBell from 'components/ChatBell/ChatBell';

const { REACT_APP_ADMIN_URL } = process.env;

export class NavigationBuilder {
  private isAlertProgress(globalDataState: IGlobalDataState): boolean {
    return false;
  }
  private isAlertChat(globalDataState: IGlobalDataState): boolean {
    return false;
  }

  public getUserMenuStructure = (globalDataState: IGlobalDataState): IUserMenuModel => [
    // {
    //   title: 'Моя страница',
    //   isActive: true,
    //   link: routes.DASHBOARD,
    //   icon: Icons.user,
    //   dataCy: 'user-menu-btn',
    // },
    {
      title: 'Объединение',
      isActive: true,
      dataCy: 'union-menu-btn',
      link: routes.UNION,
      icon: Icons.union,
      id: 'union',
    },
    {
      title: 'Чат',
      isActive: true,
      Component: ChatBell,
    },
    {
      id: 'news-suggest',
      title: 'Предложить новость',
      isActive: true,
      icon: Icons.news,
      dataCy: 'user-menu-btn',
    },
    // {
    //   title: 'мой прогресс',
    //   isActive: false,
    //   link: '#',
    //   icon: this.isAlertProgress(glogalDataState) ? Icons.notificationFavoriteChart : Icons.favoriteChart,
    // },
    {
      title: 'Уведомления',
      isActive: true,
      Component: NotificationBell,
    },
    // {
    //   title: 'чат',
    //   isActive: false,
    //   icon: this.isAlertChat(glogalDataState) ? Icons.notificationChat : Icons.chat,
    //   link: '#',
    // },
    // {
    //   title: 'новость',
    //   isActive: false,
    //   icon: Icons.news,
    //   link: '#',
    // },

    {
      title: 'Админка',
      id: 'admin',
      dataCy: 'admin-menu-btn',
      isActive: true,
      icon: Icons.securitySafe,
      action: () => {
        window.dataLayer.push({
          event: 'event',
          eventProps: {
            category: 'user',
            action: 'click',
            label: 'Admin dashboard button',
          },
        });
        window.open(`${REACT_APP_ADMIN_URL}/${globalDataState.selectedOrganisationId}/union`, 'freeunion-admin');
      },
    },
    {
      title: 'Личные данные',
      isActive: true,
      icon: Icons.briefcase,
      link: routes.EDIT_USER_PROFILE,
    },
  ];

  public getUserContentStructure = (): ILinkListList => [
    // {
    //   title: 'База знаний',
    //   isActive: false,
    //   icon: Icons.teacher,
    //   link: '#',
    // },
    // {
    //   title: 'Все cобытия',
    //   isActive: false,
    //   icon: Icons.noteAdd,
    //   link: '#',
    // },
    // {
    //   title: 'Все финансы',
    //   isActive: false,
    //   icon: Icons.presentionChart,
    //   link: '#',
    // },
    {
      title: 'Все объединения',
      dataCy: 'all-unions-btn',
      isActive: true,
      icon: Icons.taskSquare,
      link: routes.UNIONS,
    },

    {
      title: 'Создать объединение',
      isActive: true,
      icon: Icons.edit,
      link: routes.CREATE_UNION,
    },
    {
      title: 'Все новости',
      isActive: true,
      icon: Icons.lampOn,
      link: routes.NEWS,
    },
    {
      title: 'База знаний',
      isActive: true,
      icon: Icons.teacher,
      link: routes.KNOWLEDGE_BASE_MATERIALS,
    },
    {
      title: 'Помощь нашей команде!',
      isActive: true,
      icon: Icons.finance,
      link: routes.SUPPORT_US,
    },
  ];

  public getFooterContentStructure = (logoutAction: () => void): ILinkListList => {
    return [
      {
        title: 'Контакты',
        isActive: true,
        icon: Icons.contacts,
        link: routes.CONTACT_US,
      },
      {
        title: 'Безопасность',
        isActive: true,
        icon: Icons.security,
        link: routes.SECURITY,
      },
      {
        title: 'Настройки',
        isActive: true,
        icon: Icons.setting,
        link: routes.settings,
      },
      {
        title: 'Выход',
        isActive: true,
        icon: Icons.out,
        action: logoutAction,
      },
    ];
  };
}
