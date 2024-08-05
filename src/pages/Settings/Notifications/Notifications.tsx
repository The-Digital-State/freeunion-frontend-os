import Toggle from 'common/Toggle/Toggle';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './Notifications.module.scss';

function Notifications() {
  const [isPushEnabled, setIsPushEnabled] = useState(null);
  //   const [isPushSubscribed, setIsPushSubscribed] = useState(isPushEnabled);

  const isActive = isPushEnabled;

  const { user } = useContext(GlobalDataContext);

  function checkIsPushNotificationsEnabled() {
    window.OneSignal.push(function () {
      window.OneSignal.isPushNotificationsEnabled(function (isEnabled) {
        if (isEnabled) console.log('Push notifications are enabled!');
        else console.log('Push notifications are not enabled yet.');

        setIsPushEnabled(isEnabled);
      });
    });
  }

  useEffect(() => {
    checkIsPushNotificationsEnabled();

    // TODO: unsubscribe from event
    window.OneSignal.push(function () {
      // Occurs when the user's subscription changes to a new value.
      window.OneSignal.on('subscriptionChange', function (isSubscribed) {
        console.log("The user's subscription state is now:", isSubscribed);
        setIsPushEnabled(isSubscribed);

        if (isSubscribed) {
          window.OneSignal.setExternalUserId(user.id);
        }

        toast(isSubscribed ? 'Вы подписались на уведомления' : 'Вы отписались от уведомлений');
      });

      // This event can be listened to via the `on()` or `once()` listener.
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <h5>Уведомления</h5>
      <Toggle
        checked={isActive}
        valueChange={async (checked) => {
          if (checked) {
            window.OneSignal.push([
              'getNotificationPermission',
              async function (permission) {
                console.log('Site Notification Permission:', permission);
                // (Output) Site Notification Permission: default

                if (permission === 'denied') {
                  toast('Уведомления были запрещены, включите их в настройках сайта');
                }

                // if (!isPushEnabled) {
                window.OneSignal.showSlidedownPrompt({ force: true });
                // } else if (!isPushSubscribed) {
                window.OneSignal.setSubscription(true);
                // }
              },
            ]);
          } else {
            window.OneSignal.setSubscription(false);
          }
        }}
        choice={['Включить', 'Установлено']}
      />
    </div>
  );
}

export default Notifications;
