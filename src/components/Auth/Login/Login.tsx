import { useContext, useState } from 'react';
import { Input } from '../../../shared/components/common/Input/Input';
import { Link, useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ValidatorsTypes } from '../../../shared/components/common/Validator/ValidatorsTextTemplates';
import { Button } from '../../../shared/components/common/Button/Button';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { routes } from 'Routes';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

import './Login.scss';
import formatServerError from 'utils/formatServerError';
import { openRegovSSILoginBuilder } from 'components/Regov/Dialog/RegovSSILogin';
import { GlobalDataContext } from 'contexts/GlobalDataContext';

const validationSchema = Yup.object().shape({
  login: Yup.string().max(50, ValidatorsTypes.maxLength_50).trim().required(ValidatorsTypes.required),
  password: Yup.string()
    .min(8, ValidatorsTypes.minLength_8)
    .max(50, ValidatorsTypes.maxLength_50)
    .trim()
    .required(ValidatorsTypes.required),
});

export function Login() {
  const {
    services: { authService },
    spinner: { showSpinner, hideSpinner },
    openModal,
    closeModal,
  } = useContext(GlobalContext);

  const { auth } = useContext(GlobalDataContext);

  const [twoFaStep, setTwoFaStep] = useState<boolean | object>(false);

  const [asyncErrors, setAsyncErrors] = useState<{ errors?: string[] }>();

  const history = useHistory();

  const openSSI = openRegovSSILoginBuilder({
    openModal,
    closeModal,
    authService,
    auth,
    history,
  });

  async function onSubmit(values) {
    showSpinner();
    const { login, password, code } = values;

    const result = await authService.login({
      email: login,
      password,
      twoFA: twoFaStep
        ? {
            method: 'totp',
            password: code,
          }
        : undefined,
    });

    if (result.errors) {
      toast.error(formatServerError(result));
    } else if (result.need_2fa) {
      setTwoFaStep({
        creds: {
          login,
          password,
        },
      });
    } else if (result.token) {
      try {
        const urlSearchParams = new URLSearchParams(window.location.search);
        await auth.authenticate();
        // Check inviteParams to open invitation page after first login
        if (authService.inviteParams || !!localStorage.getItem('firstSession')) {
          window.dataLayer.push({
            event: 'event',
            eventProps: {
              category: 'account',
              action: 'login_first_time',
            },
          });

          history.push(routes.INVITATION_SCREEN);
        } else {
          history.push(urlSearchParams.get('redirect') ?? routes.UNION);

        }
      } catch (error) {
        // think what to do, maybe toast not needed
        toast(formatServerError(error));
      }
    }

    hideSpinner();
  }

  const _2fa = (
    <>
      <h3>Введите 2fa</h3>

      <Formik
        initialValues={{ code: '' }}
        validationSchema={validationSchema}
        validate={() => {
          return asyncErrors;
        }}
        onSubmit={onSubmit}
      >
        {({ errors, touched, values, handleSubmit, setFieldValue, setFieldTouched }) => (
          <form onSubmit={handleSubmit}>
            <Input
              name="code"
              type="number"
              valueChange={(value) => {
                setAsyncErrors({});
                setFieldValue('code', value);
              }}
              value={values.code}
              label="2fa код"
              placeholder="Код"
              maxLength={8}
              description="Код"
              onTouch={() => {
                setFieldTouched('code');
              }}
              // @ts-ignore
              error={errors?.code && touched?.code && errors.code}
            />

            <Button type="submit">Подтвердить</Button>
          </form>
        )}
      </Formik>
    </>
  );

  const loginBlock = (
    <>
      <h3>Вход</h3>
      <Formik
        initialValues={{ login: '', password: '' }}
        validationSchema={validationSchema}
        validate={() => {
          return asyncErrors;
        }}
        onSubmit={onSubmit}
      >
        {({ errors, touched, values, handleSubmit, setFieldValue, setFieldTouched }) => (
          <form onSubmit={handleSubmit}>
            <Input
              name="login"
              valueChange={(value) => {
                setAsyncErrors({});
                setFieldValue('login', value);
              }}
              value={values.login}
              label="Номер телефона или e-mail"
              placeholder="Адрес электронной почты или номер телефона"
              description="Логин"
              onTouch={() => {
                setFieldTouched('login');
              }}
              // @ts-ignore
              error={errors?.login && touched?.login && errors.login}
            />

            <div className="form-group">
              <Input
                name="password"
                type="password"
                valueChange={(value) => {
                  setAsyncErrors({});
                  setFieldValue('password', value);
                }}
                value={values.password}
                label="Пароль"
                placeholder="Введите ваш пароль"
                description="Пароль"
                onTouch={() => setFieldTouched('password')}
                // @ts-ignore
                error={errors?.password && touched?.password && errors.password}
              />
              <span className="danger">{asyncErrors?.errors?.join()}</span>
            </div>

            <div className="enter-buttons-wrapper">
              <Button type="submit" className="button-login">
                Войти
              </Button>
              <Button onClick={openSSI}>Вход через SSI</Button>
            </div>

            <div className="secondary-links-wrapper">
              <Link type="button" className="register" to={routes.REGISTRATION}>
                Присоединиться
              </Link>
              <Link type="button" className="forgot" to={routes.FORGET_PASSWORD}>
                Забыли пароль?
              </Link>
            </div>
          </form>
        )}
      </Formik>
    </>
  );

  return (
    <>
      <Helmet>
        <title>Вход</title>
      </Helmet>
      <div className="Login">{!twoFaStep ? loginBlock : _2fa}</div>
    </>
  );
}
