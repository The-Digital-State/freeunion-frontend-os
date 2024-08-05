import { useContext, useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { authenticate, callback } from 'services/commento.service';
import { GlobalContext } from '../../contexts/GlobalContext';

export function CommentoSso() {
  const {
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);
  const history = useHistory();
  const urlParams = new URLSearchParams(history.location.search);
  const commentoToken = urlParams.get('token');
  const commentoHmac = urlParams.get('hmac');

  useLayoutEffect(() => {
    (async () => {
      showSpinner();
      const response = await authenticate(commentoToken, commentoHmac);
      await callback(response?.redirect);
      hideSpinner();
      window.close();
    })();
  }, []);

  return <div />;
}
