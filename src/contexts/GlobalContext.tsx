import React, { useEffect, useRef, useState } from 'react';
import { HttpService } from '../services/http.service';
import { DictionariesService } from '../services/dictionaries.service';
import { AuthService } from '../services/auth.service';
import {
  authService,
  deviceService,
  dictionariesService,
  httpService,
  inviteLinksService,
  organisationsService,
  scrollService,
  suggestionsService,
  userService,
  navigationBuilder,
} from '../services';
import { InviteLinksService } from '../services/invite-links.service';
import { UserService } from '../services/user.service';
import { OrganisationsService } from '../services/organisations.service';
import { SuggestionsService } from '../services/suggestions.service';
import { DeviceService } from '../services/device.service';
import { ScrollService } from '../services/scroll.service';
import { NavigationBuilder } from '../services/navigation.builder';
import { isSSR } from 'utils/isSSR';

export type IModalOptions = {
  isOpen: boolean;
  params: {
    topbarLeftContainer?: React.ReactElement;
    topbarRightContainer?: React.ReactElement;
    mainContainer?: React.ReactElement;
  };
};

export type IGlobalState = {
  isMounted: boolean;
  services: {
    httpService: HttpService;
    dictionariesService: DictionariesService;
    authService: AuthService;
    inviteLinksService: InviteLinksService;
    userService: UserService;
    organisationsService: OrganisationsService;
    suggestionsService: SuggestionsService;
    deviceService: DeviceService;
    scrollService: ScrollService;
    navigationBuilder: NavigationBuilder;
  };
  isSidebarExpanded: boolean;
  setSidebarExpandedState: (status: boolean) => void;

  globalModalOptions: IModalOptions;
  openModal: (options?: Pick<IModalOptions, 'params'>) => void;
  closeModal: () => void;
  applyToOrganizationIconRef: any;
  spinner: {
    isSpinnerOpened: boolean;
    showSpinner: () => void;
    hideSpinner: () => void;
  };
  screen: {
    innerWidth: number;
  };
};

export const GlobalContext = React.createContext<IGlobalState>(null);

export const GlobalProvider = ({ children }: { children: any }) => {
  const [isSidebarExpanded, setSidebarExpandedState] = useState<boolean>();
  const [isSpinnerOpened, setIsSpinnerOpenedStatus] = useState<boolean>(false);
  const [innerWidth, setInnerWidth] = useState(
    (() => {
      if (isSSR) {
        return deviceService.isMobile ? 680 : 1280;
      }

      return window.innerWidth;
    })()
  );

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    function onResize() {
      setInnerWidth(window.innerWidth);
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // after SSR
    onResize();

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const globalModalOptions = {
    isOpen: false,
    params: {
      mainContainer: null,
      topbarLeftContainer: null,
      topbarRightContainer: null,
    },
  };
  const [globalModalState, setGlobalModalOptions] = useState<IModalOptions>(globalModalOptions);
  const openModal = (options) => {
    globalModalOptions.isOpen = true;
    globalModalOptions.params = {
      topbarLeftContainer: null,
      topbarRightContainer: null,
      mainContainer: null,
      ...options.params,
    };
    setGlobalModalOptions({ ...globalModalOptions });
  };
  const closeModal = () => {
    globalModalOptions.isOpen = false;
    globalModalOptions.params = {
      mainContainer: null,
      topbarLeftContainer: null,
      topbarRightContainer: null,
    };
    setGlobalModalOptions(globalModalOptions);
  };

  const state: IGlobalState = {
    isMounted: isMounted.current,
    isSidebarExpanded,
    setSidebarExpandedState,
    globalModalOptions: globalModalState,
    openModal,
    closeModal,
    applyToOrganizationIconRef: useRef(),
    screen: {
      innerWidth,
    },
    services: {
      httpService,
      authService,
      dictionariesService,
      inviteLinksService,
      userService,
      organisationsService,
      suggestionsService,
      deviceService,
      scrollService,
      navigationBuilder,
    },
    spinner: {
      isSpinnerOpened,
      showSpinner: () => setIsSpinnerOpenedStatus(true),
      hideSpinner: () => setIsSpinnerOpenedStatus(false),
    },
  };

  return <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>;
};
