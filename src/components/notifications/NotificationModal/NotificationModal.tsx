import { useContext, useEffect, useState } from 'react';
import { getNotification } from 'services/notifications';
import { LaborUnionInfo } from 'common/LaborUnioniInfo/LaborUnionInfo';
import moment from 'moment';
import { GlobalContext } from 'contexts/GlobalContext';
import logoSystem from '../../../public/systemAvatar.png';

import styles from './NotificationModal.module.scss';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { toast } from 'react-toastify';
import formatServerError from 'utils/formatServerError';
import { Notification, NotificationStatusEnum } from 'interfaces/notification.interface';
import { cloneDeep } from 'lodash';
import { getUrl } from 'modules/notifications';
import { Button } from 'shared/components/common/Button/Button';
import sanitizeHtml from 'sanitize-html';
import { allowedTagsSynitizer } from 'shared/constants/allowedTagsSynitizer';

function NotificationModal({ id }) {
  const [notification, setNotification] = useState<Notification>(null);

  const { notifications, setNotifications } = useContext(GlobalDataContext);

  const { closeModal } = useContext(GlobalContext);
  useEffect(() => {
    (async () => {
      try {
        const notification = await getNotification(id);

        setNotification(notification.data);

        const newNotifications = cloneDeep(notifications);

        newNotifications.find((notification) => notification.id === id).status = NotificationStatusEnum.read;

        setNotifications(newNotifications);
      } catch (e) {
        toast.error(formatServerError(e));
      }
    })();
  }, []);

  if (!notification) {
    return null;
  }

  const { from, title, message, created_at, data, type } = notification;

  const urlNotification = getUrl(type, data);

  return (
    <div className={styles.wrapper}>
      <LaborUnionInfo
        // @ts-ignore
        organisation={{
          name: from.name !== 'system' ? from.name : 'Кукушка Freeunion',
          id: data.organization_id || data.from_id || 0,
          avatar: from.logo || logoSystem,
        }}
        onClick={closeModal}
      />
      <h3 className={styles.title}>{title}</h3>
      <p
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(message, {
            allowedTags: allowedTagsSynitizer,
          }),
        }}
      ></p>
      {!!urlNotification && (
        <Button to={urlNotification} maxWidth onClick={() => closeModal()} className={styles.button}>
          Перейти
        </Button>
      )}
      <time className={styles.date}>{moment(created_at).format('DD-MM-YYYY, HH:MM:SS ')}</time>
    </div>
  );
}

export default NotificationModal;
