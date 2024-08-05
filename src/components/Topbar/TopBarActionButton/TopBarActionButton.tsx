import { GlobalContext } from 'contexts/GlobalContext';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { EnterOrganizationStatuses, IOrganizationEnterRequest } from 'interfaces/organisation.interface';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { routes } from 'Routes';
import { Button } from 'shared/components/common/Button/Button';
import formatServerError from 'utils/formatServerError';
import cn from 'classnames';
import styles from './TopBarActionButton.module.scss';
import ChatButton from 'common/ChatButton/ChatButton';

const TopBarActionButton = ({
  id,
  userInOrganisation,
  requestStatus,
  setRequestStatus,
}: {
  id: number;
  userInOrganisation: boolean;
  requestStatus: IOrganizationEnterRequest;
  setRequestStatus: (status: IOrganizationEnterRequest) => void;
}) => {
  const {
    services: { organisationsService },
  } = useContext(GlobalContext);
  const { user, selectedOrganisation, organisationMethods } = useContext(GlobalDataContext);

  const history = useHistory();

  const isAdmin = userInOrganisation && user.id === selectedOrganisation.owner_id;

  const renderButton = () => {
    switch (requestStatus?.status) {
      case EnterOrganizationStatuses.pending: {
        return (
          <Button
            onClick={async () => {
              try {
                await organisationsService.cancelUnionRequest(id);
                setRequestStatus(null);
                toast('Запрос на вступление отменен');
              } catch (error) {
                toast.error(formatServerError(error));
              }
            }}
          >
            Отменить запрос
          </Button>
        );
      }
      case EnterOrganizationStatuses.approved: {
        break;
      }
      case EnterOrganizationStatuses.rejected: {
        return <Button disabled>Запрос на вступление отклонен</Button>;
      }
      default: {
        if (!userInOrganisation && requestStatus !== undefined && !isAdmin) {
          return (
            <Button
              onClick={async () => {
                await organisationMethods.enterOrganisation(id);

                history.push(routes.enterUnion.getLink(id));
              }}
            >
              Вступить в объединение
            </Button>
          );
        }
      }
    }
  };

  return (
    <div className={cn(styles.introButton, 'p-left p-0-left-xl p-right p-0-right-md')}>
      <>
        <ChatButton organisationId={id} />
        {renderButton()}
      </>
    </div>
  );
};

export default TopBarActionButton;
