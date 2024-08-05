import { useContext, useLayoutEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { routes } from 'Routes';
import formatServerError from 'utils/formatServerError';
import { GlobalContext } from '../../contexts/GlobalContext';

export function VerifyEmail() {
  const {
    services: { authService, userService },
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);
  const history = useHistory();
  const location = useLocation();
  const { id, hash } = useParams<{ id: string; hash: string }>();

  const verifyEmail = async () => {
    showSpinner();
    const result = await authService.verifyEmail(id, hash + location.search);
    hideSpinner();

    if (!result.ok) {
      toast.error(formatServerError(result));
    } else {
      if (!location.search) {
        localStorage.setItem('firstSession', 'true');
      }

      toast('Почта подтверждена');
    }

    history.push(result.ok ? routes.LOGIN : routes.ERROR_PAGE);
  };

  useLayoutEffect(() => {
    (async () => {
      try {
        if (userService.isLoggedIn) {
          await authService.logout();
        }
      } catch (error) {
        console.error(error);
      }
      verifyEmail();
    })();
  }, []);

  return <div />; // TODO: add UI, spinner maybe
}
