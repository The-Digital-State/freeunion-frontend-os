import { Icon } from 'shared/components/common/Icon/Icon';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { useContext, useEffect, useState } from 'react';
import { getNotifications } from 'services/notifications';
import NotificationsList from '../NotificationsList/NotificationsList';
import { NotificationStatusEnum } from '../../../interfaces/notification.interface';
import styles from './NotificationBell.module.scss';
import { Icons } from 'shared/components/common/Icon/Icon.interface';

function NotificationBell() {
  const [isNotificationsListOpen, setIsNotificationsListOpen] = useState(false);

  const { notifications, setNotifications } = useContext(GlobalDataContext);

  function toggleNotifications() {
    setIsNotificationsListOpen(!isNotificationsListOpen);
  }

  async function loadNotifications() {
    try {
      const notifications = (await getNotifications()).data.data;

      setNotifications(notifications);
    } catch (error) {
      // TODO: because offline error, think
      // toast.error(formatServerError(error));
    }
  }

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 1000 * 60);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isNotificationsListOpen) {
      loadNotifications();
    }
  }, [isNotificationsListOpen]);

  const unreadNotificationsLength = notifications.filter((notification) => notification.status === NotificationStatusEnum.unread).length;

  return (
    <>
      <button onClick={toggleNotifications} className={styles.button}>
        <Icon iconName={Icons.bell} height="32" width="32" />
        {!!unreadNotificationsLength && <span className={styles.count}>{unreadNotificationsLength}</span>}
      </button>

      {isNotificationsListOpen && (
        <div className={styles.wrapper}>
          <NotificationsList close={toggleNotifications} />
        </div>
      )}
    </>
  );
}

export default NotificationBell;
