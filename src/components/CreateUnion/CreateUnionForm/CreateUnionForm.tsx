import { Formik } from 'formik';
import * as Yup from 'yup';
import styles from './CreateUnionForm.module.scss';

import { Input } from '../../../shared/components/common/Input/Input';

import { IInterestScopes, IOrganisationTypes } from '../../../interfaces';
import { ValidatorsTypes } from '../../../shared/components/common/Validator/ValidatorsTextTemplates';
import { Button } from '../../../shared/components/common/Button/Button';
import { TextArea } from '../../../shared/components/common/TextArea/TextArea';
import { Radio } from '../../../shared/components/common/Radio/Radio';
import { Select } from 'shared/components/common/Select/Select';

type ICreateUnionFormProps = {
  onFormSubmit: (values: any) => void;
  organisationTypes: IOrganisationTypes[];
  interestScope: IInterestScopes[];
  asyncErrors: { errors?: string[] };
  setAsyncErrors: (values: { errors?: string[] }) => void;
};

export function CreateUnionForm({ onFormSubmit, organisationTypes, interestScope, setAsyncErrors, asyncErrors }: ICreateUnionFormProps) {
  const validationSchema = Yup.object().shape({
    short_name: Yup.string().trim().required(ValidatorsTypes.required),
    interests: Yup.array().min(1, ValidatorsTypes.minOneOption),
    description: Yup.string().trim().required(ValidatorsTypes.required),
    type_name: Yup.string().trim().required(ValidatorsTypes.minOneOption),
  });

  const defaultFormProps = (name: string, formProps: any) => {
    const { errors, touched, values, setFieldTouched } = formProps;
    return {
      name,
      onTouch: () => {
        setFieldTouched(name);
      },
      required: true,
      value: values[name],
      error: touched[name] && errors[name],
    };
  };

  return (
    <>
      <h1>форма создания объединения</h1>
      <div className={styles.CreateUnionFormHelperText}>
        <h3>заполните форму, чтобы создать объединение</h3>
      </div>
      <Formik
        initialValues={{ short_name: '', interests: [], description: '', type_name: '' }}
        validationSchema={validationSchema}
        validate={() => {
          return asyncErrors;
        }}
        onSubmit={(values: any) => {
          onFormSubmit(values);
        }}
      >
        {(formProps) => (
          <form
            className={styles.CreateUnionForm}
            onSubmit={(e) => {
              e.preventDefault();
              formProps.validateForm();
            }}
          >
            <Input
              {...defaultFormProps('short_name', formProps)}
              valueChange={(value) => {
                setAsyncErrors({});
                formProps.setFieldValue('short_name', value);
              }}
              label="Короткое название объединения"
              description="Короткое название объединения"
              placeholder="Название"
              dataCy="name-of-union"
            />
            <Select
              {...defaultFormProps('interests', formProps)}
              label="Для кого"
              multiselect
              description="Сферы интересов"
              options={interestScope}
              labelKey="name"
              alwaysOpen
              dataCy="interests-select"
              onSelect={(value) => {
                setAsyncErrors({});
                formProps.setFieldValue('interests', value);
              }}
            />
            <TextArea
              {...defaultFormProps('description', formProps)}
              label="Фокус работы"
              placeholder="Над чем ваше объединение работает прямо сейчас"
              description="Проблемы над которыми работаете"
              dataCy="areas-of-work"
              valueChange={(value) => formProps.setFieldValue('description', value)}
            />
            <Radio
              {...defaultFormProps('type_name', formProps)}
              valueChange={(value) => formProps.setFieldValue('type_name', value)}
              options={organisationTypes}
              labelKey="name"
              dataCy="org-type"
              label="Форма объединения"
              description="Форма объединения"
            />
            <div className="form-group form-actions">
              <Button dataCy="create-union" onClick={() => formProps.validateForm().then(() => formProps.handleSubmit())} type="submit">
                Cоздать объединение
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
