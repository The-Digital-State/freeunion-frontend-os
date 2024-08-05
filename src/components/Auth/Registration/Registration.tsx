import React, { useContext, useEffect, useState } from 'react';
import { UserAgreement } from './UserAgreement/UserAgreement';
import { StepCredentials } from './StepCredentials/StepCredentials';
import { StepDataEncryption } from './StepDataEncryption/StepDataEncryption';
import { StepConfirmEmail } from './StepConfirmEmail/StepConfirmEmail';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { IScopeOfActivity } from '../../../interfaces/scope-of-activity.interface';
import { ICountry } from '../../../interfaces/country.interface';
import { Redirect, Route, useHistory } from 'react-router-dom';
import { routes } from 'Routes';

import styles from './Registration.module.scss';

type IRegistrationStep = {
  id: string;
  path: string;
  title: string;
  component: any;
  props?: object;
  progressOptions?: {
    stepNumber?: number;
    stepsCount?: number;
  };
};

const registrationSteps: IRegistrationStep[] = [
  // {
  //   id: '1',
  //   path: 'step-private-data',
  //   title: 'регистрация на платформе',
  //   component: StepPrivateData,
  //   props: null,
  //   progressOptions: {
  //     stepNumber: 1,
  //     stepsCount: 3
  //   }
  // },
  // {
  //   id: '2',
  //   title: 'регистрация на платформе',
  //   path: 'step-professional-data',
  //   component: StepProfessionalData,
  //   props: null,
  //   progressOptions: {
  //     stepNumber: 2,
  //     stepsCount: 3
  //   }
  // },
  {
    id: '3',
    path: 'step-credentials',
    title: 'регистрация на платформе',
    component: StepCredentials,
    props: null,
    progressOptions: {
      stepNumber: 3,
      stepsCount: 3,
    },
  },
  {
    id: '4',
    path: 'step-data-encryption',
    title: 'шифрование данных',
    component: StepDataEncryption,
    props: null,
  },
  {
    id: '5',
    path: 'step-confirmation-email',
    title: 'подтверждение e\u2011mail', //\u2011 дефис который не переносится на новую строку
    component: StepConfirmEmail,
    props: null,
  },
];

export function Registration() {
  const {
    services: { dictionariesService, authService },
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);
  const [countries, setCountries] = useState<ICountry[]>(null);
  const [scopes, setScopes] = useState<IScopeOfActivity[]>(null);
  const history = useHistory();

  useEffect(() => {
    const params = new URLSearchParams(history.location.search);
    const invite_id = +params.get('invite_id');
    const invite_code = params.get('invite_code');

    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'account',
        action: 'open_registration_form',
      },
    });

    if (invite_id && invite_code) {
      authService.registrationUserData = { invite_id, invite_code };
    }

    (async () => {
      // not sure why need this data
      showSpinner();
      const [countries, scopes] = await Promise.all([dictionariesService.getCountries(), dictionariesService.getActivityScopes()]);
      setCountries(countries);
      setScopes(scopes);

      hideSpinner();
    })();
  }, []);

  const goNext = async () => {
    const index = registrationSteps.findIndex((step) => history.location.pathname.includes(step.path));
    if (index > -1 && index + 1 < registrationSteps.length) {
      history.push(`${routes.REGISTRATION}/${registrationSteps[index + 1].path}` + history.location.search);
    }
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <div className={`${styles.Registration} p`}>
      <Route exact={true} path={routes.REGISTRATION}>
        <Redirect to={`${routes.REGISTRATION}/${registrationSteps[0].path}` + history.location.search} />
      </Route>
      {registrationSteps.map((step) => {
        return (
          <Route path={`${routes.REGISTRATION}/${step.path}`} key={step.id}>
            <h1>{step.title}</h1>
            <div className={styles.container}>
              <div className={styles.progressBar}>
                {/* {step?.progressOptions && (
                  <>
                    <StepsProgressBar stepNumber={step.progressOptions?.stepNumber} stepsCount={step.progressOptions?.stepsCount} />
                  </>
                )}
                <br /> */}
                {step?.progressOptions && <UserAgreement />}
              </div>
              {step
                ? React.createElement(
                    step?.component,
                    {
                      ...step?.props,
                      goNext,
                      goBack,
                      countries,
                      scopes,
                    },
                    null
                  )
                : null}
            </div>
          </Route>
        );
      })}
    </div>
  );
}
