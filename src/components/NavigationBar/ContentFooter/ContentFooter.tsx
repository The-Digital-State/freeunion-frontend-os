import { LinkList } from 'common/LinkList/LinkList';
import { GlobalContext } from 'contexts/GlobalContext';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { useContext } from 'react';
import { useHistory } from 'react-router';
import { routes } from 'Routes';

export function ContentFooter() {
  const { setUser } = useContext(GlobalDataContext);
  const {
    services: { navigationBuilder, authService },
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);

  const history = useHistory();

  const logoutAction = async () => {
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
  };

  const footerList = navigationBuilder.getFooterContentStructure(logoutAction);

  return <LinkList items={footerList} />;
}
