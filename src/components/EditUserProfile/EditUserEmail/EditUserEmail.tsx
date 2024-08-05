import { GlobalDataContext } from 'contexts/GlobalDataContext';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useContext, useState } from 'react';
import { Input } from 'shared/components/common/Input/Input';
import styles from './EditUserEmail.module.scss';
import { ValidatorsTypes } from 'shared/components/common/Validator/ValidatorsTextTemplates';
import { toast } from 'react-toastify';
import formatServerError from 'utils/formatServerError';
import { GlobalContext } from 'contexts/GlobalContext';

const EditUserEmail = () => {
  const {
    services: { userService },
  } = useContext(GlobalContext);
  const { user, setUser } = useContext(GlobalDataContext);
  const [activeNewEmail, setActiveNewEmail] = useState<boolean>(!!user.new_email);

  const cancelChanges = async (setFieldValue) => {
    if (!!user.new_email) {
      try {
        await userService.cancelChangeEmail();
        setActiveNewEmail(false);
        setFieldValue('new_email', '');
        const user = await userService.getUser();
        setUser(user);
        toast('Изменение почты отменено!');
      } catch (e) {
        toast.error(formatServerError(e));
      }
    } else {
      setActiveNewEmail(false);
      setFieldValue('new_email', '');
    }
  };

  return (
    <Formik
      initialValues={{
        email: user.email,
        new_email: user.new_email,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string(),
        new_email: Yup.string().email(ValidatorsTypes.invalidEmail).max(100, ValidatorsTypes.maxLength_100).nullable(),
      })}
      onSubmit={async (values): Promise<void> => {
        try {
          await userService.updateEmail(values.new_email);
          const user = await userService.getUser();
          setUser(user);
          toast('Подтверждение отправлено на новую почту. После подтверждения изменения вступят в силу.');
        } catch (e) {
          toast.error(formatServerError(e));
        }
      }}
    >
      {({ isSubmitting, touched, errors, isValid, dirty, setFieldValue, setFieldTouched, values }): JSX.Element => (
        <Form>
          <h3>Логин/почта</h3>
          <Input
            name="email"
            value={values.email}
            valueChange={() => {}}
            label="E-mail"
            type="email"
            description="Адрес электронной почты"
            disabled
          />
          {activeNewEmail && (
            <Input
              name="new_email"
              value={values.new_email}
              valueChange={(value) => setFieldValue('new_email', value)}
              label="Новый e-mail"
              type="email"
              disabled={!!user.new_email}
              description="Новый адрес электронной почты"
              onTouch={setFieldTouched.bind(null, 'new_email')}
              error={errors?.new_email && touched?.new_email && errors.new_email}
            />
          )}
          <div className={styles.buttonsWrapper}>
            {activeNewEmail && !user.new_email && (
              <button className={styles.addNewEmailButton} disabled={isSubmitting || !isValid || !dirty || !values.new_email} type="submit">
                Подтвердить изменение почты
              </button>
            )}
            {!!user.new_email && (
              <button className={styles.addNewEmailButton} type="submit">
                Отправить код повторно
              </button>
            )}
            {!activeNewEmail && (
              <button
                type="button"
                className={styles.addNewEmailButton}
                onClick={() => {
                  setActiveNewEmail(true);
                }}
              >
                Изменить почту
              </button>
            )}
            {!!activeNewEmail && (
              <button type="button" className={styles.addNewEmailButton} onClick={() => cancelChanges(setFieldValue)}>
                Отменить изменения
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditUserEmail;
