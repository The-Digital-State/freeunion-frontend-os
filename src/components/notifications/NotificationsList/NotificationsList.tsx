import { GlobalContext } from 'contexts/GlobalContext';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import moment from 'moment';
import { useContext, useRef, useEffect } from 'react';
import NotificationModal from '../NotificationModal/NotificationModal';
import defaultLogo from '../../../public/organisations/hero-logo-default.png';
import styles from './NotificationsList.module.scss';
import logoSystem from '../../../public/systemAvatar.png';
import { CloseButton } from 'common/CloseButton/CloseButton';
import { NotificationStatusEnum } from 'interfaces/notification.interface';

function NotificationsList({ close }) {
  const ref = useRef(null);
  const { notifications } = useContext(GlobalDataContext);
  const { openModal, isSidebarExpanded } = useContext(GlobalContext);

  function closeNotificationsList(event) {
    if (event && event.target.closest(`.${styles.wrapper}`) !== ref.current) {
      close();
    }
  }

  useEffect(() => {
    document.addEventListener('click', closeNotificationsList);
    return () => document.removeEventListener('click', closeNotificationsList);
  }, []);

  const unreadNotifications = notifications.filter((notification) => notification.status === NotificationStatusEnum.unread);

  return (
    <div className={`${styles.wrapper} ${isSidebarExpanded ? styles.withExpandedSidebar : ''}`} ref={ref}>
      <CloseButton size="small" onClick={close} className={styles.btn_close} />
      {!unreadNotifications.length ? (
        <p>Уведомлений нет</p>
      ) : (
        <ul>
          {unreadNotifications.map(({ from, id, title, status, created_at, from_id }) => {
            return (
              <li key={id}>
                <button
                  onClick={() => {
                    close();
                    openModal({
                      params: { mainContainer: <NotificationModal id={id} /> },
                    });
                  }}
                >
                  <img src={from.logo || logoSystem || defaultLogo} alt={from.name} />
                  <div>
                    <h5>
                      <strong>{from.name !== 'system' ? from.name : 'Кукушка Freeunion'}</strong>
                    </h5>
                    <p>{title}</p>
                    <span>{moment(created_at).fromNow()}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default NotificationsList;
