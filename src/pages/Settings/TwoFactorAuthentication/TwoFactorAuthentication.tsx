import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from 'contexts/GlobalContext';
import TwoFactorAuthenticationModal from './TwoFactorAuthenticationModal/TwoFactorAuthenticationModal';
import { toast } from 'react-toastify';
import styles from './TwoFactorAuthentication.module.scss';
import Toggle from 'common/Toggle/Toggle';

function TwoFactorAuthentication() {
  const {
    openModal,
    services: { authService },
  } = useContext(GlobalContext);

  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const response = await authService.register2fa();

      if (response.errors) {
        setTwoFaEnabled(true);
      }

      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <h5 className={styles.title}>Двухфакторная аутентификация</h5>

      <Toggle
        choice={['Включить', 'Установлено']}
        checked={twoFaEnabled}
        valueChange={async (value) => {
          if (value) {
            openModal({
              params: {
                mainContainer: <TwoFactorAuthenticationModal setTwoFaEnabled={setTwoFaEnabled} />,
              },
            });
            return;
          }

          const response = await authService.unregister2fa();

          if (response.errors) {
            toast.error(JSON.stringify(response.errors));
            return;
          }

          setTwoFaEnabled(false);
          toast('2FA отключена');
        }}
      />
    </div>
  );
}

export default TwoFactorAuthentication;
