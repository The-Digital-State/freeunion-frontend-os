import React, { useContext, useEffect } from 'react';
import styles from './ResetPassword.module.scss';
import { useHistory, useParams } from 'react-router-dom';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { Input } from '../../../shared/components/common/Input/Input';
import { Button } from '../../../shared/components/common/Button/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Icon } from '../../../shared/components/common/Icon/Icon';
import { routes } from 'Routes';

export function ResetPassword() {
  const {
    services: { authService },
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);
  const { token } = useParams<{ token: string }>();
  const history = useHistory();
  const urlParams = new URLSearchParams(history.location.search);
  const email = urlParams.get('email');

  const validationSchema = Yup.object().shape({
    password: Yup.string(),
  });
  const { errors, touched, values, handleSubmit, setFieldValue, validateForm, setFieldTouched } = useFormik({
    initialValues: { password: '' },
    validationSchema,
    onSubmit: async () => {
      history.push(routes.LOGIN);
    },
  });

  const resetPassword = async () => {
    if (token && email) {
      showSpinner();
      const result = await authService.resetPassword(email, token);
      if (result.ok) {
        await setFieldValue('password', result.password);
      } else {
        history.push(routes.ERROR_PAGE);
      }

      hideSpinner();
    }
  };

  useEffect(() => {
    resetPassword();
  }, []);

  return (
    <div className={styles.ResetPassword}>
      <h3>пароль успешно сгенерирован</h3>
      <Input
        name="password"
        type="password"
        valueChange={(value) => {}}
        value={values.password}
        label="Пароль"
        description="Введите ваш пароль"
        onTouch={() => setFieldTouched('password')}
        error={errors?.password && touched?.password && errors.password}
        required={true}
        showPassword={true}
      />

      <div className={styles.actions}>
        <p>
          <Icon iconName="exclamation" color="primary" />
          <span>Вы можете изменить пароль из личного профиля</span>
        </p>
        <Button onClick={() => validateForm().then(() => handleSubmit())} type="submit">
          Продолжить
        </Button>
      </div>
    </div>
  );
}
