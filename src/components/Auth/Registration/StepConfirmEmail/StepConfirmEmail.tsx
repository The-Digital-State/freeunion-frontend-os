import { useContext, useEffect, useState } from 'react';
import { Icon } from 'shared/components/common/Icon/Icon';
import { Button } from 'shared/components/common/Button/Button';
import { GlobalContext } from 'contexts/GlobalContext';
import { InputWithButton } from 'common/InputWithButton/InputWithButton';
import { ValidatorsTypes } from 'shared/components/common/Validator/ValidatorsTextTemplates';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { REGISTRATION_PUBLIC_NAME_SS_KEY } from 'constans/storage';
import styles from './StepConfirmEmail.module.scss';
import { toast } from 'react-toastify';
import formatServerError from 'utils/formatServerError';

export function StepConfirmEmail() {
  const {
    services: { authService },
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);

  const history = useHistory();
  useEffect(() => {
    const unblock = history.block();
    return () => {
      unblock();
    };
  }, []);
  const [asyncErrors, setAsyncErrors] = useState<{ [key: string]: string }>({});

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email(ValidatorsTypes.invalidEmail)
      .max(100, ValidatorsTypes.maxLength_100)
      .not([authService.registrationUserData.email], ValidatorsTypes.notUniqEmail),
  });

  const { errors, touched, values, handleSubmit, setFieldValue, isValid, validateForm, setFieldTouched } = useFormik({
    initialValues: { newEmail: '' },
    validationSchema,
    validate: () => {
      return asyncErrors;
    },
    onSubmit: async (values, actions) => {
      showSpinner();
      const result = await authService.resendEmail(authService.registrationUserData.email, values.newEmail);
      if (result.ok) {
        authService.registrationUserData = { email: values.newEmail };
        toast('Письмо отправлено');
      } else {
        actions.setErrors({ newEmail: result.errors.join() });
      }
      hideSpinner();
    },
  });

  const resendEmail = async () => {
    showSpinner();
    const { email } = authService.registrationUserData;
    const result = await authService.resendEmail(email);

    if (result.ok) {
      toast('Письмо отправлено');
    } else {
      toast.error(formatServerError(result.errors));
    }

    hideSpinner();
  };

  const publicName = sessionStorage.getItem(REGISTRATION_PUBLIC_NAME_SS_KEY);

  return (
    <div className={styles.StepConfirmEmail}>
      <div className={styles.content}>
        <div className={styles.icon}>
          <Icon iconName={'logoSmall'} width={200} height={100} />
        </div>
        <p>
          {publicName ? (
            <>
              <strong className={styles.publicName}>{publicName}</strong>, вам{' '}
            </>
          ) : (
            'Вам '
          )}
          на почту{' '}
          <a className="highlight" target="_blank" rel="noreferrer" href={`mailto:${authService.registrationUserData?.email}`}>
            {authService.registrationUserData?.email}{' '}
          </a>{' '}
          отправлено письмо. Проверьте почту и перейдите по ссылке для подтверждения е-мейла. Если письмо не пришло, проверьте папку спам
          или повторите отправку, либо введите другой е-мейл адрес
          <Button onClick={resendEmail} className={styles.btnResend}>
            Отправить повторно
          </Button>
        </p>
      </div>

      <div className={styles.actions}>
        <InputWithButton
          inputProps={{
            name: 'newEmail',
            value: values.newEmail,
            valueChange: (value) => {
              delete asyncErrors.newEmail;
              validateForm();
              setFieldValue('newEmail', value, true);
              setAsyncErrors({ ...asyncErrors });
            },
            label: 'Изменить адрес электронной почты',
            description: '',
            type: 'email',
            onTouch: () => {
              setFieldTouched('newEmail');
            },
            error: errors?.newEmail && touched?.newEmail && errors.newEmail,
          }}
          buttonProps={{
            children: 'Отправить',
            onClick: () => validateForm().then(() => handleSubmit()),
            type: 'submit',
            disabled: !isValid || !values.newEmail.trim(),
          }}
        />
      </div>
    </div>
  );
}
