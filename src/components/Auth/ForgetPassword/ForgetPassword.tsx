import { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ValidatorsTypes } from '../../../shared/components/common/Validator/ValidatorsTextTemplates';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { Input } from '../../../shared/components/common/Input/Input';
import { Button } from '../../../shared/components/common/Button/Button';

import styles from './ForgetPassword.module.scss';
import { toast } from 'react-toastify';

export function ForgetPassword() {
  const {
    services: { authService },
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);

  const validationSchema = Yup.object().shape({
    email: Yup.string().trim().email(ValidatorsTypes.invalidEmail).max(100).required(ValidatorsTypes.required),
  });

  const { errors, touched, values, handleSubmit, setFieldValue, validateForm, setFieldTouched } = useFormik({
    initialValues: { email: '' },
    validationSchema,
    onSubmit: async (values, actions) => {
      showSpinner();
      const result = await authService.forgetPassword(values.email);
      if (result.ok) {
        toast(() => {
          return (
            <a href={'//' + values.email.split('@')[1]} target="_blank" rel="noreferrer">
              Письмо было успешно отправлено
            </a>
          );
        });
      } else {
        actions.setErrors({
          email: result.errors.join(),
        });
      }
      hideSpinner();
    },
  });

  return (
    <div className={styles.ForgetPassword}>
      <h3>смена пароля</h3>

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await validateForm();
          handleSubmit();
        }}
      >
        <Input
          name="email"
          value={values.email}
          valueChange={(value) => {
            setFieldValue('email', value, true);
          }}
          label="E-mail"
          type="email"
          description="Адрес электронной почты"
          placeholder="Введите адрес электронной почты*"
          onTouch={setFieldTouched}
          error={errors?.email && touched?.email && errors.email}
          required
        />

        <div className={styles.actions}>
          <Button type="submit">Отправить</Button>
        </div>
      </form>
    </div>
  );
}
