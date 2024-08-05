import { useContext, useState } from 'react';
import { Button } from '../../../../shared/components/common/Button/Button';
import { Input } from '../../../../shared/components/common/Input/Input';
import { Checkbox } from '../../../../shared/components/common/Checkbox/Checkbox';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ValidatorsTypes } from '../../../../shared/components/common/Validator/ValidatorsTextTemplates';
import { IUser } from '../../../../interfaces/user.interface';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { PASSWORD_PATTERN } from '../../../../shared/components/common/Validator/validators';
import { REGISTRATION_PUBLIC_NAME_SS_KEY } from 'constans/storage';
import { routes } from 'Routes';
import { Link } from 'react-router-dom';

import styles from './StepCredentials.module.scss';
import { toast } from 'react-toastify';
import formatServerError from 'utils/formatServerError';

type IStepCredentialsProps = {
  goNext?: () => void;
  goBack?: () => void;
};

export function StepCredentials({ goNext, goBack }: IStepCredentialsProps) {
  const {
    services: { authService },
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);
  const [asyncErrors, setAsyncErrors] = useState<{ [key: string]: string }>({});
  const [isNavigationToLoginButtonShown, setNavigationToLoginButtonState] = useState<boolean>(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email(ValidatorsTypes.invalidEmail)
      .max(100, ValidatorsTypes.maxLength_100)
      .required(ValidatorsTypes.required),
    // login: Yup.string().max(50, ValidatorsTypes.maxLength_50).trim().required(ValidatorsTypes.required),
    password: Yup.string()
      .min(8, ValidatorsTypes.minLength_8)
      .max(50, ValidatorsTypes.maxLength_50)
      .trim()
      .matches(PASSWORD_PATTERN, ValidatorsTypes.notValidPassword)
      .required(ValidatorsTypes.required),
    _confirm_password: Yup.string()
      .trim()
      .oneOf([Yup.ref('password'), null], ValidatorsTypes.confirmPassword)
      .required(ValidatorsTypes.required),
    _accept: Yup.boolean(),
    mailing: Yup.boolean(),
  });

  const { errors, touched, values, handleSubmit, setFieldValue, isValid, validateForm, setFieldTouched } = useFormik({
    initialValues: authService.registrationUserData, // not needed
    validationSchema,
    validate: () => {
      return asyncErrors;
    },
    onSubmit: async (values, actions) => {
      showSpinner();

      const { email, password, mailing } = values;
      const { invite_code, invite_id } = authService.registrationUserData;

      const newUser: IUser & { _accept: boolean; mailing: boolean } = {
        email,
        password,
        mailing,
        invite_code,
        invite_id,
      } as IUser & { _accept: boolean; mailing: boolean }; // fix types

      const result = await authService.register(newUser);

      const { public_family, public_name } = result;

      if (public_family && public_name) {
        sessionStorage.setItem(REGISTRATION_PUBLIC_NAME_SS_KEY, `${public_family} ${public_name}`);
      }

      if (result.ok) {
        goNext();
      } else if (result.errors) {
        setAsyncErrors(result.errors);
        actions.validateForm();
        toast.error(formatServerError(result));

        if (result.errors?.login || result.errors?.email) {
          setNavigationToLoginButtonState(true);
        }
      }
      hideSpinner();
    },
  });

  authService.registrationUserData = values;

  return (
    <div className={styles.StepCredentials}>
      <h3>логин (e-mail) / пароль</h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          validateForm().then(() => handleSubmit());
        }}
      >
        <Input
          name="email"
          value={values.email}
          valueChange={(value) => {
            delete asyncErrors.email;
            validateForm();
            setFieldValue('email', value, true);
            setAsyncErrors({ ...asyncErrors });
          }}
          label="E-mail"
          type="email"
          description="Адрес электронной почты"
          onTouch={() => {
            setFieldTouched('email');
          }}
          error={errors?.email && touched?.email && errors.email}
          required={true}
        />

        <Input
          name="password"
          type="password"
          valueChange={(value) => {
            setFieldValue('password', value, true);
          }}
          value={values.password}
          label="Пароль"
          description="Введите ваш пароль"
          onTouch={() => setFieldTouched('password')}
          error={errors?.password && touched?.password && errors.password}
          required={true}
        />
        <Input
          name="_confirm_password"
          type="password"
          valueChange={(value) => {
            setFieldValue('_confirm_password', value, true);
          }}
          value={values._confirm_password}
          label="Подтвердить пароль"
          description="Подтвердите пароль"
          onTouch={() => setFieldTouched('_confirm_password')}
          error={errors?._confirm_password && touched?._confirm_password && errors._confirm_password}
          required={true}
        />

        <Checkbox
          value={values._accept}
          valueChange={(value) => setFieldValue('_accept', value)}
          name="_accept"
          type="small"
          className={styles.RegistrationCheckbox}
          label={
            <div>
              {'Принять '}
              <Link to={routes.RULES_SERVICE} target="_blank">
                пользовательское соглашение
              </Link>
              {' и '}
              <Link to={routes.PRIVACY_POLICY} target="_blank">
                политику конфиденциальности
              </Link>
              {' *'}
            </div>
          }
          onTouch={() => setFieldTouched('_accept')}
          error={errors?._accept && touched?._accept && errors._accept}
        />
        <Checkbox
          value={values.mailing}
          valueChange={(value) => setFieldValue('mailing', value)}
          name="mailing"
          type="small"
          className={styles.RegistrationCheckbox}
          label={<div>Согласен получать рассылку</div>}
          onTouch={() => setFieldTouched('mailing')}
          error={errors?.mailing && touched?.mailing && errors.mailing}
        />
        <div className={`${styles.actions} form-group form-actions`}>
          <Button
            onClick={() => {
              goBack();
            }}
            maxWidth
          >
            Назад
          </Button>
          <Button type="submit" disabled={!values._accept || !isValid} maxWidth>
            Далее
          </Button>
        </div>
        {isNavigationToLoginButtonShown && (
          <p>
            Уже есть аккаунт? <Link to={routes.LOGIN}>Логин</Link>
          </p>
        )}
      </form>
    </div>
  );
}
