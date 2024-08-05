import { useContext, useEffect, useLayoutEffect } from 'react';
import { Routes, routes } from 'Routes';
import { GlobalContext } from 'contexts/GlobalContext';
import { AppInformation } from 'common/AppInformation/AppInformation';
import { SpinnerGlobal } from 'common/SpinnerGlobal/SpinnerGlobal';
import { GlobalModal } from 'components/GlobalModal/GlobalModal';
import { useHistory, matchPath, useLocation } from 'react-router-dom';
import { authService } from 'services';
import { IInviteParams } from 'interfaces/invite-params.interface';
import { ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet';

import toastStyles from 'shared/styles/Toast.module.scss';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { checkIfShowNotificationPopUp, NOTIFICATION_LS_KEY } from 'modules/notifications';
import Feedback, { checkIfShowFeedbackModal } from 'shared/components/modals/Feedback/Feedback';

const { REACT_APP_COOKIE_BOT_ID } = process.env;

// @ts-ignore
let previousPathname: routes;

function App() {
  const {
    globalModalOptions: { isOpen },
    spinner: { isSpinnerOpened },
    services: { httpService, suggestionsService },
    openModal,
    closeModal,
  } = useContext(GlobalContext);

  const { auth, user } = useContext(GlobalDataContext);

  const history = useHistory();
  const location = useLocation();

  useLayoutEffect(() => {
    const param = new URLSearchParams(history.location.search);
    if (param.has('invite_id') && param.has('invite_code')) {
      const inviteParams: { [key: string]: string | number } = Object.fromEntries(param.entries());
      inviteParams.invite_id = +inviteParams.invite_id;

      // @ts-ignore
      authService.inviteParams = inviteParams as IInviteParams;
      suggestionsService.needSuggestionSwipeTraining = true;
      httpService.clearToken();

      // InviteLink data -> registration process
      history.push(`${routes.INVITATION_PAGE}${history.location.search}`);
    }

    if (REACT_APP_COOKIE_BOT_ID) {
      const scriptElement = document.createElement('script');
      scriptElement.setAttribute('id', 'Cookiebot');
      scriptElement.setAttribute('src', 'https://consent.cookiebot.com/uc.js');
      scriptElement.setAttribute('data-cbid', REACT_APP_COOKIE_BOT_ID);
      scriptElement.setAttribute('data-blockingmode', 'auto');
      scriptElement.setAttribute('type', 'text/javascript');

      document.head.appendChild(scriptElement);
    }
  }, []);

  // Scroll to top after navigation to new route
  useEffect(() => {
    // @ts-ignore
    previousPathname = history.location.pathname as routes;

    const unsubscribeListener = history.listen((location) => {
      if ((location as { state?: { disableScroll?: boolean } })?.state?.disableScroll) {
        return;
      }
      if (!matchPath(location.pathname, { path: previousPathname, exact: true })) {
        document.body.scrollIntoView({
          behavior: 'auto',
          block: 'start',
          inline: 'nearest',
        });

        // @ts-ignore
        previousPathname = location.pathname as RoutesOld;
      }
    });

    return () => {
      unsubscribeListener();
    };
  }, []);

  // // block navigation when any modal is open
  // useEffect(() => {
  //   let unblock;
  //   if (isOpen) {
  //     unblock = history.block();
  //   }

  //   return () => {
  //     return unblock && unblock();
  //   };
  // }, [isOpen]);

  useEffect(() => {
    if (httpService.token) {
      auth.authenticate();
    }
  }, []);

  useEffect(() => {
    // logged user visited /union page
    if (
      !user ||
      !matchPath(location.pathname, {
        exact: true,
        path: routes.union.route,
      })
    ) {
      return;
    }

    if (checkIfShowFeedbackModal()) {
      openModal({
        params: {
          mainContainer: <Feedback chatLink={routes.chat} closeModal={closeModal} />,
        },
      });
    }

    window.OneSignal.push(function () {
      if (checkIfShowNotificationPopUp()) {
        window.OneSignal.showSlidedownPrompt({ force: true });

        localStorage.setItem(NOTIFICATION_LS_KEY, String(Date.now()));
      }

      window.OneSignal.on('subscriptionChange', function (isSubscribed) {
        console.log("The user's subscription state is now:", isSubscribed);

        if (isSubscribed) {
          // not sure if need this data

          // window.dataLayer.push({
          //   event: 'event',
          //   eventProps: {
          //     category: 'push_notifications',
          //     action: 'subscribe',
          //     label: 'profile_page',
          //   },
          // });

          window.OneSignal.setExternalUserId(user.id);
        }
      });
    });
  }, [user, location]);

  return (
    <>
      <Helmet>
        <title>FreeUnion online</title>
        <meta
          name="description"
          content="Сервисная платформа для самоорганизации и работы людей в общественных объединения и инициативах"
        />

        <meta property="og:title" content="FreeUnion online" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.REACT_APP_BASE_URL}${location.pathname}`} />
        <meta property="og:image" content={`${process.env.REACT_APP_BASE_URL}${process.env.PUBLIC_URL}/logo-small.svg`} />
      </Helmet>

      <AppInformation />
      <Routes />

      <ToastContainer progressClassName={toastStyles.toastProgressBar} />
      {isOpen && <GlobalModal />}

      {isSpinnerOpened && <SpinnerGlobal />}
    </>
  );
}

export default App;
