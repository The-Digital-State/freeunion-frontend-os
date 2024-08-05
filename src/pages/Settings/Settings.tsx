import TwoFactorAuthentication from './TwoFactorAuthentication/TwoFactorAuthentication';
import { Helmet } from 'react-helmet';

import styles from './Settings.module.scss';
import Notifications from './Notifications/Notifications';

function Settings() {
  return (
    <div className={styles.wrapper}>
      <Helmet>
        <title>Настройки</title>
      </Helmet>

      <h3>Настройки</h3>

      <Notifications />
      <TwoFactorAuthentication />
    </div>
  );
}

export default Settings;
