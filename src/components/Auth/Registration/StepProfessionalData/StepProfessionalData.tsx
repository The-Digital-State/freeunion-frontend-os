import React, { useContext, useEffect, useState } from 'react';
import styles from './StepProfessionalData..module.scss';
import { Input } from '../../../../shared/components/common/Input/Input';
import { Select } from 'shared/components/common/Select/Select';

import { Button } from '../../../../shared/components/common/Button/Button';
import { Radio } from '../../../../shared/components/common/Radio/Radio';
import { employmentForms } from '../../../../constans/employmentForms';
import { ValidatorsTypes } from '../../../../shared/components/common/Validator/ValidatorsTextTemplates';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IScopeOfActivity } from '../../../../interfaces/scope-of-activity.interface';
import { IUser } from '../../../../interfaces/user.interface';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { debounce } from 'lodash';
import { IPlace } from '../../../../interfaces/place.interface';

type IStepProfessionalDataProps = {
  goNext?: () => void;
  goBack?: () => void;
  scopes?: IScopeOfActivity[];
};

let debounceCallback = null;
function setDebounceCallback(callback) {
  debounceCallback = callback;
}
const callDebounceCallback = (name) => {
  debounceCallback && debounceCallback(name);
};
const delayedHandleChange = debounce(callDebounceCallback, 500);

export function StepProfessionalData({ goNext, goBack, scopes }: IStepProfessionalDataProps) {
  const {
    services: { dictionariesService, authService },
  } = useContext(GlobalContext);

  const [workPlaces, setWorkPlaces] = useState<IPlace[]>(null);
  const [isWorkPlacesLoading, setIsWorkPlacesLoadingStatus] = useState<boolean>(false);

  const validationSchema = Yup.object().shape({
    worktype: Yup.number().nullable().required(ValidatorsTypes.required),
    scope: Yup.number().nullable().default(null).required(ValidatorsTypes.required),
    work_place: Yup.string().trim().max(200, ValidatorsTypes.maxLength_200).required(ValidatorsTypes.required),
    work_position: Yup.string().trim().max(50, ValidatorsTypes.maxLength_50).required(ValidatorsTypes.required),
  });

  const searchPlace = async (name: string) => {
    if (name?.length > 2) {
      setIsWorkPlacesLoadingStatus(true);
      const workPlaces = (await dictionariesService.searchPlace(name)) || null;
      setWorkPlaces(workPlaces);
      setIsWorkPlacesLoadingStatus(false);
    }
  };

  useEffect(() => {
    setDebounceCallback(searchPlace);

    return () => {
      setDebounceCallback(null);
    };
  }, []);

  const { errors, touched, values, handleSubmit, setFieldValue, validateForm, setFieldTouched, isValid } = useFormik({
    validationSchema,
    initialValues: authService.registrationUserData as IUser & { _accept: boolean },
    onSubmit: () => {
      goNext();
    },
  });

  authService.registrationUserData = values;

  return (
    <div className={styles.StepProfessionalData}>
      <h3>Профессиональные данные</h3>
      <>
        <br />
        <Radio
          value={values.worktype}
          valueChange={(value) => setFieldValue('worktype', value)}
          options={employmentForms}
          name="employmentForm"
          label="Форма занятости"
          onTouch={() => setFieldTouched('worktype')}
          error={errors?.worktype && touched?.worktype && errors.worktype}
          required={true}
        />

        <Select
          label="Сфера"
          description="Выберите сферу деятельности вашей организации"
          options={scopes}
          value={values.scope}
          labelKey="name"
          onSelect={(value) => setFieldValue('scope', value)}
          onTouch={() => setFieldTouched('scope')}
          error={errors?.scope && touched?.scope && errors.scope}
          required={true}
        />

        <Input
          name="work_place"
          valueChange={(value) => {
            setFieldValue('work_place', value);
            delayedHandleChange.cancel();
            delayedHandleChange(value);
          }}
          value={values.work_place}
          label="Место работы / учёбы"
          description="Официальное название организации"
          onTouch={() => setFieldTouched('work_place')}
          error={errors?.work_place && touched?.work_place && errors.work_place}
          autocompleteOptions={workPlaces}
          autocompleteOptionsLabelKey="short"
          autocompleteOnSelect={(value) => {
            setFieldValue('work_place', value);
            setWorkPlaces(null);
          }}
          autocompleteOnCancel={() => {
            setWorkPlaces(null);
          }}
          isAutocompleteOptionsLoading={isWorkPlacesLoading}
          required={true}
        />

        <Input
          name="work_position"
          valueChange={(value) => setFieldValue('work_position', value)}
          value={values.work_position}
          label="Должность / специальность"
          description="Ваша должность"
          onTouch={() => setFieldTouched('work_position')}
          error={errors?.work_position && touched?.work_position && errors.work_position}
          required={true}
        />

        <div className={`${styles.actions} form-group form-actions`}>
          <Button
            onClick={() => {
              goBack();
            }}
          >
            Назад
          </Button>

          <Button onClick={() => validateForm().then(() => handleSubmit())} type="submit" disabled={!isValid}>
            Далее
          </Button>
        </div>
      </>
    </div>
  );
}
