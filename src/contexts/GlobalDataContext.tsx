import { IUnionActions, IUser, UnionActionsKeys } from '../interfaces/user.interface';
import { IOrganisation, IOrganisationShort, RequestTypes } from '../interfaces/organisation.interface';
import React, { useContext, useState } from 'react';
import { ISuggestion } from '../interfaces/suggestion.interface';
import { GlobalContext } from './GlobalContext';
import { Notification } from 'interfaces/notification.interface';
import { toast } from 'react-toastify';
import formatServerError from 'utils/formatServerError';
import { toastMessageWithTitle } from 'shared/utils/toastMessageWithTitle';
import { IHelpOffer } from 'interfaces/help-offer.interface';
import { useDispatch } from 'react-redux';
import { matchPath, useHistory } from 'react-router-dom';
import { routes } from 'Routes';
import sockets from 'shared/modules/sockets';
import { getUrl } from 'modules/notifications';

export type IGlobalDataState = {
  user?: IUser;
  setUser: (user: IUser) => void;

  organisations: IOrganisationShort[];
  setOrganisations: (organisations: IOrganisationShort[]) => void;

  selectedOrganisationId: number;
  selectedOrganisation: IOrganisation;
  selectOrganisation: (organisationId: number, organisation?: IOrganisation) => void;

  updateUnionActions: (id: number, key: UnionActionsKeys, value: boolean) => void;

  suggestions: ISuggestion[];
  setSuggestions: (suggestions: ISuggestion[]) => void;

  helpOffers: {
    data: IHelpOffer[];
    getHelpOffers: (organisationId: number) => void;
  };

  auth: {
    authenticate: () => void;
    unauthenticate: () => void;
    isLoading: boolean;
  };

  // maybe rename
  organisationMethods: {
    enterOrganisation: (organisationId: number) => void;
    leaveOrganisation: (organisationId: number, reason?: string) => void;
  };
  unionEnterRequests: {
    data: object;
    getUnionEnterRequests: () => {};
  };

  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
};

export const GlobalDataContext = React.createContext<IGlobalDataState>(null);

export const GlobalDataProvider = ({ children }: { children: any }) => {
  const {
    spinner: { showSpinner, hideSpinner },
    services: { organisationsService, userService },
  } = useContext(GlobalContext);

  const [user, setUser] = useState<IUser>(null);
  const [organisations, setOrganisations] = useState<IOrganisationShort[]>([]);
  const [selectedOrganisation, setSelectedOrganisationState] = useState<IOrganisation>(null);
  const [suggestions, setSuggestions] = useState<ISuggestion[]>(null);
  const [notifications, setNotifications] = useState([]);
  const [unionEnterRequests, setUnionEnterRequests] = useState({});
  const [isAuthLoading, setAuthLoading] = useState(false);

  const [helpOffers, setHelpOffers] = useState<IHelpOffer[] | []>([]);

  const dispatch = useDispatch();

  const history = useHistory();

  async function getUnionEnterRequests() {
    try {
      const requests = await organisationsService.getUnionRequests();

      const r = requests.reduce((prev, curr) => {
        const { organization_id } = curr;
        prev[organization_id] = curr;
        return prev;
      }, {});

      setUnionEnterRequests(r);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  }

  // TODO: эту парашу нужно порефакторить
  async function authenticate() {
    const redirectToLogin = async () => {
      // token is expired or inactive

      // temp
      if (
        ![routes.SUPPORT_US, routes.HOME, routes.NEWS, routes.NEWS_BELARUS_FOR_UKRAINE].some((route) =>
          matchPath(window.location.pathname, {
            exact: true,
            path: route,
          })
        )
      ) {
        history.push({
          pathname: routes.LOGIN,
          search: `?redirect=${window.location.pathname + window.location.search}`,
        });
      }
    };

    const isLoggedIn = userService.isLoggedIn;

    if (!user) {
      if (isLoggedIn) {
        setAuthLoading(true);
        let loadedUser = await userService.getUser();

        // @ts-ignore
        if (loadedUser?.data?.errors) {
          // @ts-ignore
          if (loadedUser.data.errors.status !== 401) {
            // чтобы не появлсля тост ошибки если мы аутентифицируемся не на приватных страницах
            // кейс когда токен просрочивается

            // @ts-ignore
            toast.error(formatServerError(loadedUser.data));
          }

          return redirectToLogin();
        }

        setUser(loadedUser);

        const notificationToken = localStorage.getItem('notificationToken');

        if (notificationToken) {
          sockets.init(notificationToken);
          sockets.subscribe(loadedUser.id, dispatch, getUrl);
        }
        const { settings, membership } = loadedUser;

        // @ts-ignore
        const { lastOpenedOrganisationId } = settings || {};

        if (!!membership?.length && lastOpenedOrganisationId) {
          const isLastOpenedOrgMember = !!membership.find((org) => org.id === lastOpenedOrganisationId);

          selectOrganisation(isLastOpenedOrgMember ? lastOpenedOrganisationId : membership[0].id);
        }
      } else {
        redirectToLogin();
        return;
      }

      setAuthLoading(false);
    }
  }

  function unauthenticate() {
    // TODO: clear data, use this func
    setUser(null);
  }

  async function getHelpOffers(organisationId) {
    try {
      const data = await organisationsService.getHelpOffers(organisationId);

      setHelpOffers(data);
    } catch (error) {
      toast.error(formatServerError(error));
    }
  }

  async function enterOrganisation(organisationId) {
    showSpinner();

    try {
      const result = await organisationsService.enterOrganisation(organisationId);

      setUnionEnterRequests({
        ...unionEnterRequests,
        // @ts-ignore
        [result.data.organization_id]: result.data,
      });

      let organisation = organisations.find((organisation) => organisation.id === organisationId);

      if (!organisation) {
        try {
          organisation = await organisationsService.getOrganisationById(organisationId);
          setOrganisations([...organisations, organisation]);
        } catch (error) {
          console.log(error); // 404, closed union
        }
      }

      let toastText: string;
      let toastTitle: string;
      switch (organisation?.request_type) {
        case RequestTypes.Immediately:
          if (organisation) {
            selectOrganisation(organisationId);
          }
          setUser({ ...user, membership: [...user.membership, organisation] });
          toastTitle = 'Новое объединение';
          toastText = `Вы успешно вступили в объединение ${organisation.name}!`;
          break;

        default:
          toastTitle = 'Заявка отправлена';
          toastText = `Ваша заявка на вступление отправлена в объединение ${organisation.name}`;
          break;
      }

      toast(toastMessageWithTitle(toastTitle, toastText));

      window.dataLayer.push({
        event: 'event',
        eventProps: {
          category: 'union',
          action: 'enter_union',
          value: organisationId,
        },
      });
    } catch (error) {
      toast.error(formatServerError(error));
      throw error;
    } finally {
      hideSpinner();
    }
  }

  async function leaveOrganisation(organisationId, reason) {
    showSpinner();
    const result = await organisationsService.leaveOrganisation(organisationId, reason);
    hideSpinner();

    if (result.ok) {
      const { membership } = user;
      const leavedOrganization = membership.find((organization) => organization.id === organisationId);
      membership.splice(membership.indexOf(leavedOrganization), 1);

      setUser({ ...user, membership: [...membership] });

      toastMessageWithTitle('Вы вышли из объединения', `Вы вышли из объединения ${leavedOrganization.name}`);

      window.dataLayer.push({
        event: 'event',
        eventProps: {
          category: 'union',
          action: 'leave_union',
          value: organisationId,
        },
      });

      const newSelectedUnion = membership[0]?.id;

      if (newSelectedUnion) {
        selectOrganisation(newSelectedUnion);
      } else {
        setSelectedOrganisationState(null);
      }
    } else {
      toast.error(formatServerError(result));
      throw result;
    }
  }

  const updateUnionActions = async (id: number, key: UnionActionsKeys, value: boolean) => {
    const unionActions: IUnionActions[] = user.settings.unionActions || [];
    const activeUnion: IUnionActions = unionActions.find((unionAction) => unionAction.organisationId === id) || {
      organisationId: id,
    };
    activeUnion[key] = value;

    await userService.setUserSettings({ unionActions: [...unionActions.filter((s) => s.organisationId !== id), activeUnion] }, true);

    setUser((user) => {
      return {
        ...user,
        settings: {
          ...user.settings,
          unionActions: [...unionActions.filter((s) => s.organisationId !== id), activeUnion],
        },
      };
    });
  };

  const selectOrganisation = async (organisationId: number) => {
    // const searchParams = selectedOrganisation ? `?organisation=${selectedOrganisation.id}` : '';
    // history.push(`${history.location.pathname}${searchParams}`);

    // const organization = organisations.find((organisation) => organisation.id === organisationId);
    // if (organization) {
    //   fix types to prevent network call
    //   setSelectedOrganisationState(organization);
    //   return;
    // }

    try {
      const loadedOrganisation = await organisationsService.getOrganisationById(organisationId);
      // history.push(routes.union.getLink(organisationId));
      setSelectedOrganisationState(loadedOrganisation);
      userService.setLastViewedOrganisation(loadedOrganisation.id);
    } catch (error) {
      throw error;
    }
  };

  const state: IGlobalDataState = {
    user,
    setUser,
    organisations,
    organisationMethods: {
      enterOrganisation,
      leaveOrganisation,
    },
    setOrganisations,
    selectedOrganisationId: selectedOrganisation?.id || null,
    selectedOrganisation,
    selectOrganisation,
    suggestions,
    setSuggestions,
    notifications,
    setNotifications,
    helpOffers: {
      data: helpOffers,
      getHelpOffers,
    },
    auth: {
      authenticate,
      unauthenticate,
      isLoading: isAuthLoading,
    },
    updateUnionActions,
    unionEnterRequests: {
      data: unionEnterRequests,
      getUnionEnterRequests,
    },
  };

  if (process.env.NODE_ENV !== 'production') {
    // @ts-ignore;
    window.store = state;
  }

  return <GlobalDataContext.Provider value={state}>{children}</GlobalDataContext.Provider>;
};
