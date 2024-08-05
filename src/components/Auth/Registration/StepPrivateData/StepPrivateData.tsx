import { useContext, useEffect, useState } from 'react';
import styles from './StepPrivateData.module.scss';
import { Input } from 'shared/components/common/Input/Input';
import { Select } from 'shared/components/common/Select/Select';
import { TextArea } from 'shared/components/common/TextArea/TextArea';
import { Checkbox } from 'shared/components/common/Checkbox/Checkbox';
import { Button } from 'shared/components/common/Button/Button';
import { IUser, sexesList } from 'interfaces/user.interface';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ICountry } from 'interfaces/country.interface';
import { ValidatorsTypes } from 'shared/components/common/Validator/ValidatorsTextTemplates';
import moment from 'moment';
import { CustomDatePicker } from 'common/CustomDatePicker/CustomDatePicker';
import { GlobalContext } from 'contexts/GlobalContext';
import { routes } from 'Routes';

const { REACT_APP_BASE_URL } = process.env;

type IStepPrivateDataProps = {
  goNext?: () => void;
  countries?: ICountry[];
};

export function StepPrivateData({ goNext, countries }: IStepPrivateDataProps) {
  const {
    services: { authService },
  } = useContext(GlobalContext);

  const validationSchema = Yup.object().shape({
    family: Yup.string().nullable().trim().max(50, ValidatorsTypes.maxLength_50).required(ValidatorsTypes.required),
    name: Yup.string().nullable().trim().max(50, ValidatorsTypes.maxLength_50).required(ValidatorsTypes.required),
    patronymic: Yup.string().nullable().trim().max(50, ValidatorsTypes.maxLength_50),
    sex: Yup.number().min(0).max(1).required(ValidatorsTypes.required),
    birthday: Yup.string().nullable().trim().required(ValidatorsTypes.required),
    // birthday: Yup.string().nullable().trim().matches(/^[0-9]{2}-[0-9]{2}-[0-9]{4}$/, ValidatorsTypes.dateFormat).required(ValidatorsTypes.required),
    country: Yup.string().required(ValidatorsTypes.required),
    about: Yup.string().max(500, ValidatorsTypes.maxLength_500).trim(),
    address: Yup.string().nullable().max(200, ValidatorsTypes.maxLength_200).required(ValidatorsTypes.required),
    phone: Yup.string()
      .nullable()
      .min(9, ValidatorsTypes.minLength_9)
      .max(9, ValidatorsTypes.maxLength_9)
      .required(ValidatorsTypes.required),
    _accept: Yup.boolean(),
  });
  const minAge = 16;
  const maxDateBirthday = new Date();
  maxDateBirthday.setFullYear(moment().year() - minAge);
  const minDateBirthday = new Date();
  minDateBirthday.setFullYear(1900, 0, 0);

  const { errors, touched, values, handleSubmit, setFieldValue, validateForm, setFieldTouched, isValid } = useFormik({
    initialValues: authService.registrationUserData as IUser & { _accept: boolean },
    validationSchema,
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (values.birthday) {
        const date = moment(values.birthday);
        if (moment().diff(date, 'year') < 16) {
          errors.birthday = ValidatorsTypes.minDate;
        }
      }

      return errors;
    },
    onSubmit: () => {
      goNext();
    },
  });
  authService.registrationUserData = values;

  const [mobilePrefix, setMobilePrefix] = useState<string>('');

  const updatePrefix = (countryCode: string) => {
    setTimeout(() => {
      const country = countries?.find((c) => c.id === countryCode);
      if (country) {
        setMobilePrefix(`+${country.code}`);
      }
    });
  };

  useEffect(() => {
    if (values.country) {
      updatePrefix(values.country);
    }
  }, [countries]);

  return (
    <div className={styles.StepPrivateData}>
      <h3>введите Личные данные</h3>

      <>
        <Input
          name="family"
          valueChange={(value) => setFieldValue('family', value)}
          value={values.family}
          label="Фамилия"
          description="Как в паспорте"
          onTouch={() => setFieldTouched('family')}
          error={errors?.family && touched?.family && errors.family}
          required={true}
        />
        <Input
          name="name"
          valueChange={(value) => setFieldValue('name', value)}
          value={values.name}
          label="Имя"
          description="Как в паспорте"
          onTouch={() => setFieldTouched('name')}
          error={errors?.name && touched?.name && errors.name}
          required={true}
        />
        <Input
          name="patronymic"
          valueChange={(value) => setFieldValue('patronymic', value)}
          value={values.patronymic}
          label="Отчество"
          description="Как в паспорте"
          onTouch={() => setFieldTouched('patronymic')}
          error={errors?.patronymic && touched?.patronymic && errors.patronymic}
        />

        <CustomDatePicker
          name="birthday"
          valueChange={(value) => {
            setFieldValue('birthday', value);
          }}
          value={values.birthday as Date}
          label="Дата рождения"
          description="ДД-ММ-ГГГГ"
          onTouch={() => setFieldTouched('birthday')}
          error={errors?.birthday && touched?.birthday && errors.birthday}
          required={true}
          minDate={minDateBirthday}
          maxDate={maxDateBirthday}
        />

        <Select
          label="Страна"
          description="Выберите страну"
          options={countries}
          value={values.country}
          onSelect={(value) => {
            setFieldValue('country', value);
            updatePrefix(value);
          }}
          labelKey="name"
          onTouch={() => setFieldTouched('country')}
          error={errors?.country && touched?.country && errors.country}
          required={true}
        />

        <Select
          label="Пол"
          description="Пол"
          options={sexesList}
          value={values.sex}
          onSelect={(value) => setFieldValue('sex', value)}
          onTouch={() => setFieldTouched('sex')}
          error={errors?.sex && touched?.sex && errors.sex}
          required={true}
        />

        <TextArea
          name="about"
          label="О себе"
          placeholder="Информация понадобится, если вы захотите стать руководителем или войти в комиссию. Введенные в этом поле данные видны другим пользователям платформы"
          description="Расскажите о себе"
          value={values.about}
          valueChange={(value) => setFieldValue('about', value)}
          onTouch={() => setFieldTouched('about')}
          error={errors?.about && touched?.about && errors.about}
        />

        <Input
          name="address"
          valueChange={(value) => setFieldValue('address', value, true)}
          value={values.address}
          label="Адрес"
          description="Адрес проживания"
          onTouch={() => setFieldTouched('address')}
          error={errors?.address && touched?.address && errors.address}
          required={true}
        />

        <Input
          name="phone"
          valueChange={(value) => setFieldValue('phone', value, true)}
          value={values.phone}
          label="Телефон"
          description="Код оператора и номер телефона (всего 9 цифр)"
          type="number"
          onTouch={() => setFieldTouched('phone')}
          error={errors?.phone && touched?.phone && errors.phone}
          required={true}
          prefix={mobilePrefix}
        />

        <Checkbox
          value={values._accept}
          valueChange={(value) => setFieldValue('_accept', value)}
          name="_accept"
          label={
            <span>
              принять
              <span className="highlight">
                <a href={`${REACT_APP_BASE_URL}${routes.RULES_SERVICE}`} target="_blank" rel="noreferrer">
                  {' '}
                  пользовательское соглашение
                </a>
                ,{' '}
                <a href={`${REACT_APP_BASE_URL}${routes.PRIVACY_POLICY}`} target="_blank" rel="noreferrer">
                  {' '}
                  политику конфиденциальности
                </a>
                ,
              </span>
              necessery сookies и готов получать уведомления от системы
            </span>
          }
          onTouch={() => setFieldTouched('_accept')}
          error={errors?._accept && touched?._accept && errors._accept}
        />

        <div className="form-group form-actions">
          <Button onClick={() => validateForm().then(() => handleSubmit())} type="submit" disabled={!values._accept || !isValid}>
            Далее
          </Button>
        </div>
      </>
    </div>
  );
}
