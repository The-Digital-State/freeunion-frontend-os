import { forwardRef, useEffect, useState } from 'react';
import KanbanCardModal from '../KanbanCardModal/KanbanCardModal';
import styles from './KanbanCard.module.scss';
import { CardInfo } from 'shared/services/tasks.service';
import { toast } from 'react-toastify';
import { useLocation, useHistory } from 'react-router';
import { Icon } from 'shared/components/common/Icon/Icon';
import { CustomImage } from 'shared/Chat/components/CustomImage/CustomImage';
import KanbanCardModalActions from '../KanbanCardModalActions/KanbanCardModalActions';
import { routes } from 'Routes';
import { Button } from 'shared/components/common/Button/Button';
import { assignMeTask } from 'shared/services/tasks.service';
import formatServerError from 'shared/utils/formatServerError';
import { OrganizationShort } from 'shared/interfaces/organization';
import { UserShort } from 'shared/interfaces/user';
import classNames from 'classnames';

interface Props {
  card: CardInfo;
  dragging: boolean;
  fetchTasks: () => void;
  openModal: (component: object, modalProps: object) => void;
  closeModal: () => void;
  getOrganizationUsers: (value: { organizationId?: string }) => Promise<{ data: OrganizationShort[] }>;
  isAdminApp?: boolean;
  orgId?: string;
  userInOrganization: boolean;
  user: UserShort;
}

const KanbanCard = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    card,
    getOrganizationUsers,
    fetchTasks,
    openModal,
    closeModal,
    user,
    isAdminApp,
    orgId,
    userInOrganization,
    ...other
  } = props;
  const location = useLocation();
  const { search } = location;
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const goToTaskSceen = (): void => {
    // @ts-ignore
    history.push(routes?.task.getLink(orgId, card.id));
  };
  const handleClose = (): void => {
    fetchTasks();
    closeModal();
  };
  const handleOpen = (): void => {
    if (isAdminApp) {
      openModal(
        <KanbanCardModal
          orgId={orgId}
          openModal={openModal}
          card={card}
          getOrganizationUsers={getOrganizationUsers}
          closeModal={closeModal}
          isAdminApp={isAdminApp}
        />,
        { isTask: true, actions: <KanbanCardModalActions card={card} onClose={handleClose} orgId={orgId} /> }
      );
    } else {
      goToTaskSceen();
    }
  };

  useEffect(() => {
    if (search && search.split('=')[1] === String(card.id)) {
      handleOpen();
    }
  }, []);

  const cardUsers = () => {
    const maxLength = 4;
    const result = card.users.slice(0, maxLength).map((user) => {
      return <CustomImage key={user.id} src={user.public_avatar} alt="user logo" width={24} height={24} />;
    });

    if (card.users.length > maxLength) {
      result.push(<span className={styles.UsersLogo}>+{card.users.length - maxLength}</span>);
    }

    return result.reverse();
  };

  return (
    <>
      <div ref={ref} className={styles.KanbanCard} {...other}>
        <div onClick={handleOpen} className={styles.Card}>
          {card.image && (
            <div className={styles.CardMedia}>
              <img src={card.image} alt="cardlogo" />
            </div>
          )}
          <div className={styles.CardContent}>
            <div className={styles.CardTitle}>
              <span>{card.title}</span>
            </div>
           <div className={`${styles.FlexCenter} ${styles.CardContentContainer}`}>
              <div className={`${styles.FlexCenter}`}>
                <div
                  className={`${styles.FlexCenter} ${styles.IconWrapper}`}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    if (isAdminApp) {
                      navigator.clipboard.writeText(`${window.location}?cardId=${card.id}`);
                    } else {
                      navigator.clipboard.writeText(`${window.location}/tasks/${card.id}`);
                    }
                    toast('Ссылка скопирована в буфер обмена');
                  }}
                >
                  <Icon iconName="share" />
                </div>
                {card.is_urgent && <div title="Срочная задача" className={classNames(styles.lightIconWrapper, { [styles.coloredlightIcon]: !isAdminApp })}>
                  <Icon iconName="light" />
                </div>}
              </div>
              {card.users.length > 0 && <div className={styles.UsersContainer}>{cardUsers()}</div>}
            </div>
            {userInOrganization &&
              !card.users.find((u) => u.id === user.id) &&
              card.can_self_assign &&
              !!card?.visibility && (
                <Button
                  disabled={isLoading}
                  className={styles.asignBtn}
                  primary
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      setIsLoading(true);
                      await assignMeTask(orgId, card.id);
                      toast('Задача взята!');
                      goToTaskSceen();
                    } catch (error) {
                      toast.error(formatServerError(error));
                      console.dir(error);
                    }
                    setIsLoading(false);
                  }}
                >
                  Взять задачу
                </Button>
              )}
          </div>
        </div>
      </div>
    </>
  );
});

export default KanbanCard;
