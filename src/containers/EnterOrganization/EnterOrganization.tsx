import { ReactNode, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Default from './steps/Default/Default';
import Rejected from './steps/Rejected/Rejected';

import { SimpleRoutingContainer } from 'common/Routing/SimpleRoutingContainer/SimpleRoutingContainer';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { GlobalContext } from 'contexts/GlobalContext';
import { EnterOrganizationStatuses, IOrganizationEnterRequest } from 'interfaces/organisation.interface';
import { toast } from 'react-toastify';
import formatServerError from 'utils/formatServerError';

// import styles from './EnterOrganization.module.scss';

function EnterOrganization() {
  const [enterRequest, setEnterRequest] = useState<IOrganizationEnterRequest | null>(null);

  const {
    spinner: { showSpinner, hideSpinner },
    services: { organisationsService },
  } = useContext(GlobalContext);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    (async () => {
      try {
        showSpinner();
        const enterRequest = await organisationsService.getOrganizationEnterRequestById(+id);
        setEnterRequest(enterRequest);
      } catch (error) {
        toast.error(formatServerError(error));
      }

      hideSpinner();
    })();
  }, []);

  if (!enterRequest) {
    return null;
  }

  let component = null;
  const { status } = enterRequest;

  switch (status) {
    case EnterOrganizationStatuses.approved:
    case EnterOrganizationStatuses.pending:
    case EnterOrganizationStatuses.active:
      component = <Default type={status === EnterOrganizationStatuses.pending ? Default.Types.confirmation : undefined} id={+id} />;
      break;

    case EnterOrganizationStatuses.rejected:
      component = <Rejected comment={enterRequest.request} />;
      break;

    default:
      toast.error('Ошибка');
      break;
  }

  return <div>{component}</div>;
}

function Container({ title, children, className }: { className?: string; title: string; children: ReactNode }) {
  const { id } = useParams<{ id: string }>();

  const { organisations } = useContext(GlobalDataContext);

  const organization = organisations.find((organization) => organization.id === +id);

  const { avatar, name } = organization || {};

  return (
    <SimpleRoutingContainer
      title={title}
      showCloseButton
      hideFooter
      className={className}
      logo={{
        src: avatar,
        alt: name,
      }}
    >
      {children}
    </SimpleRoutingContainer>
  );
}

EnterOrganization.Container = Container;

export default EnterOrganization;
