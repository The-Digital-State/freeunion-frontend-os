import { useContext, useEffect, useState } from 'react';
import { Button } from 'shared/components/common/Button/Button';
import { Input } from 'shared/components/common/Input/Input';
import { GlobalContext } from 'contexts/GlobalContext';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { ValidatorsTypes } from 'shared/components/common/Validator/ValidatorsTextTemplates';

import styles from './TwoFactorAuthenticationModal.module.scss';
import formatServerError from 'utils/formatServerError';

function TwoFactorAuthenticationModal({ setTwoFaEnabled }) {
  const [twoFaData, setTwoFaData] = useState({
    qrcode: '',
    secret: '',
  });

  const [otpPasswords, setOtpPasswords] = useState([]);

  const {
    // closeModal,
    services: { authService },
  } = useContext(GlobalContext);

  useEffect(() => {
    (async () => {
      const response = await authService.register2fa();
      const { qrcode, secret } = response;

      if (response.errors) {
        toast.error(JSON.stringify(response.errors));
        return;
      }

      setTwoFaData({
        qrcode,
        secret,
      });
    })();
  }, []);

  return (
    <div className={styles.wrapper}>
      {!otpPasswords.length ? (
        <>
          <h3>Добавить 2FA</h3>

          <p>Отканируйте QR код или добавьте ключ вручную в ваше Authenticator приложение.</p>

          <a href="https://support.google.com/accounts/answer/1066447?hl=ru&co=GENIE.Platform%3DAndroid" target="_blank" rel="noreferrer">
            Нет Authenticator приложения?
          </a>
        </>
      ) : (
        <>
          <h3>Ваши пароли</h3>

          <p>Сохраните пароли в надежном месте, они будут нужны при утере доступа к устройству с Authenticator</p>

          <ul>
            {otpPasswords.map((password) => {
              return <li key={password}>{password}</li>;
            })}
          </ul>
        </>
      )}

      {twoFaData.qrcode && !otpPasswords.length && (
        <>
          <img src={twoFaData.qrcode} alt="QR код" />

          <Input valueChange={() => {}} value={twoFaData.secret} disabled label="Ключ (для ввода в приложении вручную)" />

          <Formik
            onSubmit={async (values) => {
              const response = await authService.enable2fa(values.secret);

              if (response.errors) {
                toast.error(formatServerError(response));
                return;
              }
              toast('Двухфакторная аутентификация добавлена успешно');

              window.dataLayer.push({
                event: 'event',
                eventProps: {
                  category: 'user',
                  action: 'add2fa',
                },
              });

              setTwoFaEnabled(true);
              setOtpPasswords(response.otp_passwords);
            }}
            initialValues={{
              secret: '',
            }}
            validationSchema={Yup.object().shape({
              secret: Yup.string().trim().required(ValidatorsTypes.required),
            })}
          >
            {({ errors, values, handleSubmit, setFieldValue }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <p>
                    Введите код, который вы видите в мобильном приложении (название аккаунта <i>FreeUnion</i>):
                  </p>
                  <Input
                    type="number"
                    maxLength={8}
                    label="Код из приложения"
                    error={errors['secret']}
                    value={values['secret']}
                    valueChange={(secret) => {
                      setFieldValue('secret', secret);
                    }}
                  />

                  <Button type="submit">Добавить</Button>
                </form>
              );
            }}
          </Formik>
        </>
      )}
    </div>
  );
}

export default TwoFactorAuthenticationModal;
