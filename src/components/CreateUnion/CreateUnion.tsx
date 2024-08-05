import { useContext, useState, useEffect } from 'react';
import { IInterestScopes, IOrganisationTypes } from '../../interfaces';
import { GlobalContext } from '../../contexts/GlobalContext';
import { CreateUnionForm } from './CreateUnionForm/CreateUnionForm';
import { CreateUnionSuccess } from './CreateUnionSuccess/CreateUnionSuccess';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { Helmet } from 'react-helmet';

import styles from './CreateUnion.module.scss';

export function CreateUnion() {
  const {
    services: { dictionariesService, organisationsService },
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);
  const { setOrganisations, organisations, selectOrganisation, setUser, user } = useContext(GlobalDataContext);

  const [asyncErrors, setAsyncErrors] = useState<{ errors?: string[] }>();
  const [organisationTypes, setOrganisationTypes] = useState<IOrganisationTypes[]>([]);
  const [interestScope, setInterestScope] = useState<IInterestScopes[]>([]);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const getOrganisationTypes = async () => {
    const organisationTypes = await dictionariesService.getOrganisationTypes();
    setOrganisationTypes(organisationTypes);
  };
  const getActivityScopes = async () => {
    const interestScope = await dictionariesService.getInterestScopes();
    setInterestScope(interestScope);
  };

  useEffect(() => {
    (async () => {
      showSpinner();

      await getOrganisationTypes();
      await getActivityScopes();

      hideSpinner();
    })();

    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'union',
        action: 'open_registration_form',
      },
    });
  }, []);

  const onFormSubmit = async (values: any) => {
    showSpinner();

    const { interests, type_name, ...formValues } = values;
    const group = organisationTypes.find((type) => type_name === type.id);
    const name = `${group?.name} "${formValues.short_name}"`;
    const body = { ...formValues, name, type_name: group?.name, type_id: group?.id };
    const result = await organisationsService.createOrganisation(body);

    if (result?.errors) {
      setAsyncErrors(result);
    } else {
      const newOrganization = await organisationsService.updateOrganisationInterests(result.id, interests);
      if (newOrganization?.errors) {
        setAsyncErrors(result);
      } else {
        setOrganisations([...organisations, newOrganization]);
        selectOrganisation(result.id);
        setUser({ ...user, membership: [...user.membership, newOrganization], administer: [...user.administer, newOrganization] });

        setShowSuccess(true);
      }
    }

    hideSpinner();
  };

  return (
    <div className={`${styles.CreateUnionPage} ${showSuccess && styles.CreateUnionPageSuccess} p-left p-right`}>
      <Helmet>
        <title>Создать объединение</title>
      </Helmet>

      {showSuccess ? (
        <CreateUnionSuccess />
      ) : (
        <>
          <CreateUnionForm
            onFormSubmit={onFormSubmit}
            organisationTypes={organisationTypes}
            interestScope={interestScope}
            asyncErrors={asyncErrors}
            setAsyncErrors={setAsyncErrors}
          />
          <span className="highlight">
            {asyncErrors?.errors &&
              Object.keys(asyncErrors?.errors)
                .map((errorKey) => asyncErrors?.errors[errorKey].join(', '))
                .join(', ')}
          </span>
        </>
      )}
    </div>
  );
}
