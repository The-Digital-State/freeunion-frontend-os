import React, { useContext, useEffect, useState } from 'react';
import styles from './EditUserProfile.module.scss';

import { GlobalContext } from '../../contexts/GlobalContext';
import { Button } from '../../shared/components/common/Button/Button';
import { useFormik } from 'formik';
import { IUser, sexesList } from '../../interfaces/user.interface';
import { Input } from '../../shared/components/common/Input/Input';
import { Select } from 'shared/components/common/Select/Select';
import { TextArea } from '../../shared/components/common/TextArea/TextArea';
import { Checkbox } from '../../shared/components/common/Checkbox/Checkbox';
import { ValidatorsTypes } from '../../shared/components/common/Validator/ValidatorsTextTemplates';
import * as Yup from 'yup';
import { Radio } from '../../shared/components/common/Radio/Radio';
import { ICountry } from '../../interfaces/country.interface';
import { IScopeOfActivity } from '../../interfaces/scope-of-activity.interface';
import { employmentForms } from '../../constans/employmentForms';
import { debounce } from 'lodash';
import { IPlace } from '../../interfaces/place.interface';
import moment from 'moment';
import { EditUserAvatar } from './EditUserAvatar/EditUserAvatar';
import { EditUserPublicName } from './EditUserPublicName/EditUserPublicName';
import { CustomDatePicker } from '../../common/CustomDatePicker/CustomDatePicker';
import { useHistory } from 'react-router-dom';
import { PASSWORD_PATTERN } from '../../shared/components/common/Validator/validators';
import { GlobalDataContext } from '../../contexts/GlobalDataContext';
import { IGeneratePublicName } from '../../services/user.service';
import { toast } from 'react-toastify';
import { routes } from 'Routes';
import { Helmet } from 'react-helmet';
import EditUserEmail from './EditUserEmail/EditUserEmail';

const privateDataVisibility: { id: number; name: string }[] = [
  { id: 0, name: 'Не видит никто' },
  { id: 1, name: 'Видят только члены моего объединения' },
  { id: 2, name: 'Видят все' },
];

const fieldsForPublicShow: (keyof IUser)[] = [
  'family',
  'name',
  'patronymic',
  'birthday',
  // 'country',
  // 'sex',
  'work_position',
  'address',
  'phone',
];

type IUserToUpdate = IUser & {
  _confirm_password: string;
  _selectFieldsToShow: boolean;
  _fieldsForPublicShowHash: { [key: string]: boolean };
};

const validationSchema = Yup.object().shape({
  is_public: Yup.number(),
  _selectFieldsToShow: Yup.boolean(),

  family: Yup.string().max(50, ValidatorsTypes.maxLength_50),
  name: Yup.string().max(50, ValidatorsTypes.maxLength_50),
  patronymic: Yup.string().max(50, ValidatorsTypes.maxLength_50),
  sex: Yup.number().nullable().min(0).max(1),
  birthday: Yup.string().nullable(),
  country: Yup.string().nullable(),
  about: Yup.string().max(500, ValidatorsTypes.maxLength_500),
  address: Yup.string().max(200, ValidatorsTypes.maxLength_200),
  phone: Yup.string().nullable().max(15, ValidatorsTypes.maxLength_15),

  worktype: Yup.number().nullable(),
  scope: Yup.number().nullable().default(null),
  work_place: Yup.string().max(200, ValidatorsTypes.maxLength_200).nullable(),
  work_position: Yup.string().max(50, ValidatorsTypes.maxLength_50),

  email: Yup.string().email(ValidatorsTypes.invalidEmail).max(100, ValidatorsTypes.maxLength_100).required(ValidatorsTypes.required),
  // login: Yup.string().max(50, ValidatorsTypes.maxLength_50).required(ValidatorsTypes.required),
  password: Yup.string()
    .min(8, ValidatorsTypes.minLength_8)
    .max(50, ValidatorsTypes.maxLength_50)
    .matches(PASSWORD_PATTERN, ValidatorsTypes.notValidPassword),
  _confirm_password: Yup.string().oneOf([Yup.ref('password'), null], ValidatorsTypes.confirmPassword),
});

const minAge = 16;
const maxDateBirthday = new Date();
maxDateBirthday.setFullYear(moment().year() - minAge);
const minDateBirthday = new Date();
minDateBirthday.setFullYear(1900, 0, 0);

export function EditUserProfile() {
  const history = useHistory();

  const {
    services: { dictionariesService, userService },
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);

  const { user: savedUser, setUser } = useContext(GlobalDataContext);

  const [userLocal, setUserLocal] = useState<IUserToUpdate>({
    ...savedUser,
    _confirm_password: '',
    work_position: savedUser.work_position || '',
    address: savedUser.address || '',
    patronymic: savedUser.patronymic || '',
    name: savedUser.name || '',
    family: savedUser.family || '',
    about: savedUser.about || '',

    birthday: savedUser.birthday ? new Date(savedUser.birthday) : '', //moment(savedUser.birthday, 'YYYY-MM-DD').format(),
    _selectFieldsToShow: !!savedUser.hiddens.length,
    _fieldsForPublicShowHash: Object.fromEntries(fieldsForPublicShow.map((field) => [field, !savedUser.hiddens.includes(field)])),
  });

  const [countries, setCountries] = useState<ICountry[]>(null);
  const [scopes, setScopes] = useState<IScopeOfActivity[]>(null);
  const delayedHandleChange = debounce((name) => searchPlace(name), 500);
  const [workPlaces, setWorkPlaces] = useState<IPlace[]>(null);
  const [isWorkPlacesLoading, setIsWorkPlacesLoadingStatus] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      showSpinner();
      const [countries, scopes] = await Promise.all([dictionariesService.getCountries(), dictionariesService.getActivityScopes()]);
      setCountries(countries);
      setScopes(scopes);
      hideSpinner();
    })();
  }, []);

  const { errors, touched, values, handleSubmit, setFieldValue, validateForm, setFieldTouched } = useFormik({
    initialValues: userLocal as IUserToUpdate,
    validationSchema: validationSchema,
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      const date = moment(values.birthday);

      if (moment().diff(date, 'year') < 16) {
        errors.birthday = ValidatorsTypes.minDate;
      }

      return errors;
    },
    onSubmit: async (values, actions) => {
      showSpinner();
      await onUpdateUser(values);
      if (values.password && values._confirm_password) {
        const result = await onUpdatePassword(values.password);
        if (result) {
          actions.setFieldValue('password', '');
          actions.setFieldValue('_confirm_password', '');
        }
      }
      await onVisibilityUpdate(values);
      await savePublicName();
      toast('Информация обновлена');
      const user = await userService.getUser();
      setUser(user);
      hideSpinner();
      history.push(routes.UNION);
    },
  });

  const searchPlace = async (name: string) => {
    if (name?.length > 2) {
      setIsWorkPlacesLoadingStatus(true);
      const workPlaces = (await dictionariesService.searchPlace(name)) || null;
      setWorkPlaces(workPlaces);
      setIsWorkPlacesLoadingStatus(false);
    }
  };

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

  const [generatedNewPublicName, setGeneratedNewPublicName] = useState<IGeneratePublicName>();

  const savePublicName = async () => {
    if (generatedNewPublicName) {
      const result = await userService.savePublicName(generatedNewPublicName);
      if (result.ok) {
        setUser({ ...savedUser, can_change_public: false });
      }
    }
  };

  const onCancel = () => {
    if (history.location.key) {
      history.goBack();
    } else {
      // When it is first opened
      history.push(routes.UNION);
    }
  };

  const onUpdateUser = async (user: IUser) => {
    const userToUpdate: Partial<IUser> = {};
    Object.keys(user).forEach((key) => {
      if (key === 'is_public' || key === 'hiddens' || key === 'password' || key === '_confirm_password' || key[0] === '_') {
        return;
      }
      if (user[key] !== userLocal[key]) {
        userToUpdate[key] = user[key];
      }
    });

    if (Object.keys(userToUpdate).length) {
      userToUpdate.id = userLocal.id;
      if (userToUpdate.birthday) {
        userToUpdate.birthday = moment(userToUpdate.birthday).format('YYYY-MM-DD');
      }
      await userService.updateUser(userToUpdate);
      setUser({ ...savedUser, ...userToUpdate });
    }
  };

  const onUpdatePassword = async (password: string): Promise<boolean> => {
    const result = await userService.updatePassword(password);
    setUserLocal({ ...userLocal, password: '', _confirm_password: '' });

    return result.ok;
  };

  const onVisibilityUpdate = async (values: IUserToUpdate) => {
    const { is_public, _fieldsForPublicShowHash, _selectFieldsToShow } = values;
    let hiddenList;

    if (is_public === 0) {
      hiddenList = fieldsForPublicShow;
    } else if (is_public > 0) {
      hiddenList = _selectFieldsToShow ? Object.keys(_fieldsForPublicShowHash).filter((key) => !_fieldsForPublicShowHash[key]) : [];
    }

    await userService.updateVisibility({ is_public, hiddens: hiddenList });
  };

  return (
    <div className={`${styles.EditUserProfile} p-top p-bottom p-left p-0-left-lg p-right p-0-right-lg`}>
      <Helmet>
        <title>Профиль</title>
      </Helmet>
      <h1>Редактирование данных</h1>
      <div className={`${styles.container}`}>
        <h3>как вас видят другие пользователи</h3>

        <div className={styles.card}>
          <EditUserAvatar />

          <br />
          <EditUserPublicName setGeneratedNewPublicName={setGeneratedNewPublicName} />

          <div className={styles.about}>
            <br />
            <h3>Информация о себе</h3>
            <TextArea
              name="about"
              placeholder="Информация понадобится, если вы захотите стать руководителем или войти в комиссию"
              value={values.about}
              valueChange={(value) => {
                setFieldValue('about', value, true);
              }}
              onTouch={() => {
                if (!touched.about) {
                  setFieldTouched('about');
                }
              }}
              error={errors?.about && touched?.about && errors.about}
              bgColor="white"
            />
          </div>
        </div>

        <br />
        <br />
        <h3>Видимость личных данных</h3>

        <Radio
          value={values.is_public}
          valueChange={setFieldValue.bind(null, 'is_public')}
          options={privateDataVisibility}
          labelKey="name"
          name="is_public"
          label="Кто видит"
          onTouch={() => setFieldTouched('is_public')}
          error={errors?.is_public && touched?.is_public && errors.is_public}
        >
          {!!values.is_public && (
            <Checkbox
              value={values._selectFieldsToShow}
              valueChange={(value) => setFieldValue('_selectFieldsToShow', value)}
              name="_selectFieldsToShow"
              label="Выбрать данные для отображения"
              onTouch={() => setFieldTouched('_selectFieldsToShow')}
            />
          )}
        </Radio>

        <br />
        <br />
        <h3>Личные данные</h3>

        <div className={styles.controlWithVisibilityCheckbox}>
          <Input
            name="family"
            valueChange={(value) => {
              setFieldValue('family', value);
            }}
            value={values.family}
            label="Фамилия"
            description="Как в паспорте"
            onTouch={() => {
              if (!touched.family) {
                setFieldTouched('family');
              }
            }}
            error={errors?.family && touched?.family && errors.family}
          />

          {!!values.is_public && values._selectFieldsToShow && (
            <div className={`${styles.visibilityCheckbox} form-group`}>
              <Checkbox
                value={values._fieldsForPublicShowHash.family || false}
                valueChange={(value) => setFieldValue('_fieldsForPublicShowHash.family', value)}
                name="_fieldsForPublicShowHash.family"
              />
            </div>
          )}
        </div>

        <div className={styles.controlWithVisibilityCheckbox}>
          <Input
            name="name"
            valueChange={(value) => setFieldValue('name', value)}
            value={values.name}
            label="Имя"
            description="Как в паспорте"
            onTouch={setFieldTouched.bind(null, 'name')}
            error={errors?.name && touched?.name && errors.name}
          />

          {!!values.is_public && values._selectFieldsToShow && (
            <div className={`${styles.visibilityCheckbox} form-group`}>
              <Checkbox
                value={values._fieldsForPublicShowHash.name || false}
                valueChange={(value) => setFieldValue('_fieldsForPublicShowHash.name', value)}
                name="_fieldsForPublicShowHash.name"
              />
            </div>
          )}
        </div>

        <div className={styles.controlWithVisibilityCheckbox}>
          <Input
            name="patronymic"
            valueChange={(value) => setFieldValue('patronymic', value)}
            value={values.patronymic}
            label="Отчество"
            description="Как в паспорте"
            onTouch={setFieldTouched.bind(null, 'patronymic')}
            error={errors?.patronymic && touched?.patronymic && errors.patronymic}
          />

          {!!values.is_public && values._selectFieldsToShow && (
            <div className={`${styles.visibilityCheckbox} form-group`}>
              <Checkbox
                value={values._fieldsForPublicShowHash.patronymic || false}
                valueChange={(value) => setFieldValue('_fieldsForPublicShowHash.patronymic', value)}
                name="_fieldsForPublicShowHash.patronymic"
              />
            </div>
          )}
        </div>

        <div className={styles.controlWithVisibilityCheckbox}>
          <CustomDatePicker
            name="birthday"
            valueChange={(value) => {
              setFieldValue('birthday', value);
            }}
            value={values.birthday}
            label="Дата рождения"
            description="ДД-ММ-ГГГГ"
            onTouch={setFieldTouched.bind(null, 'birthday')}
            error={errors?.birthday && touched?.birthday && errors.birthday}
            minDate={minDateBirthday}
            maxDate={maxDateBirthday}
          />

          {/*<Input*/}
          {/*    name="birthday"*/}
          {/*    valueChange={(value) => {*/}
          {/*        const birthday = formatDate(value);*/}
          {/*        setFieldValue('birthday', birthday)*/}
          {/*    }}*/}
          {/*    value={values.birthday}*/}
          {/*    label="Дата рождения"*/}
          {/*    description="ДД-ММ-ГГГГ"*/}
          {/*    onTouch={() => setFieldTouched('birthday')}*/}
          {/*    error={errors?.birthday && touched?.birthday && errors.birthday}*/}
          {/*    required={true}*/}
          {/*/>*/}

          {!!values.is_public && values._selectFieldsToShow && (
            <div className={`${styles.visibilityCheckbox} form-group`}>
              <Checkbox
                value={values._fieldsForPublicShowHash.birthday || false}
                valueChange={(value) => setFieldValue('_fieldsForPublicShowHash.birthday', value)}
                name="_fieldsForPublicShowHash.birthday"
              />
            </div>
          )}
        </div>

        <div className={styles.controlWithVisibilityCheckbox}>
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
            onTouch={setFieldTouched.bind(null, 'country')}
            error={errors?.country && touched?.country && errors.country}
          />

          {/*{!!values.is_public && values._selectFieldsToShow && (*/}
          {/*    <div className={`${styles.visibilityCheckbox} form-group`}>*/}
          {/*        <Checkbox*/}
          {/*            value={values._fieldsForPublicShowHash.country || false}*/}
          {/*            valueChange={(value) => setFieldValue('_fieldsForPublicShowHash.country', value)}*/}
          {/*            name='_fieldsForPublicShowHash.country'*/}
          {/*        />*/}
          {/*    </div>*/}
          {/*)}*/}
        </div>

        <div className={styles.controlWithVisibilityCheckbox}>
          <Select
            label="Пол"
            description="Пол"
            options={sexesList}
            value={values.sex}
            onSelect={(value) => setFieldValue('sex', value)}
            onTouch={setFieldTouched.bind(null, 'sex')}
            error={errors?.sex && touched?.sex && errors.sex}
          />

          {/*{!!values.is_public && values._selectFieldsToShow && (*/}
          {/*    <div className={`${styles.visibilityCheckbox} form-group`}>*/}
          {/*        <Checkbox*/}
          {/*            value={values._fieldsForPublicShowHash.sex || false}*/}
          {/*            valueChange={(value) => setFieldValue('_fieldsForPublicShowHash.sex', value)}*/}
          {/*            name='_fieldsForPublicShowHash.sex'*/}
          {/*        />*/}
          {/*    </div>*/}
          {/*)}*/}
        </div>

        <div className={styles.controlWithVisibilityCheckbox}>
          <Input
            name="address"
            valueChange={(value) => setFieldValue('address', value, true)}
            value={values.address}
            label="Адрес"
            description="Адрес проживания"
            onTouch={setFieldTouched.bind(null, 'address')}
            error={errors?.address && touched?.address && errors.address}
          />

          {!!values.is_public && values._selectFieldsToShow && (
            <div className={`${styles.visibilityCheckbox} form-group`}>
              <Checkbox
                value={values._fieldsForPublicShowHash.address || false}
                valueChange={(value) => setFieldValue('_fieldsForPublicShowHash.address', value)}
                name="_fieldsForPublicShowHash.address"
              />
            </div>
          )}
        </div>

        <div className={styles.controlWithVisibilityCheckbox}>
          <Input
            name="phone"
            valueChange={(value) => setFieldValue('phone', value, true)}
            value={values.phone}
            label="Телефон"
            description="Код оператора и номер телефона"
            type="number"
            onTouch={setFieldTouched.bind(null, 'phone')}
            error={errors?.phone && touched?.phone && errors.phone}
            prefix={mobilePrefix}
          />

          {!!values.is_public && values._selectFieldsToShow && (
            <div className={`${styles.visibilityCheckbox} form-group`}>
              <Checkbox
                value={values._fieldsForPublicShowHash.phone || false}
                valueChange={(value) => setFieldValue('_fieldsForPublicShowHash.phone', value)}
                name="_fieldsForPublicShowHash.phone"
              />
            </div>
          )}
        </div>

        <br />
        <br />
        <h3>Профессиональные данные</h3>
        <Select
          label="Форма занятости"
          description="Выберите форму занятости" // maybe should change
          value={values.worktype}
          onSelect={(value) => setFieldValue('worktype', value)}
          options={employmentForms}
          name="employmentForm"
          onTouch={setFieldTouched.bind(null, 'worktype')}
          error={errors?.worktype && touched?.worktype && errors.worktype}
        />

        <Select
          label="Сфера"
          description="Выберите сферу деятельности вашей организации"
          options={scopes}
          value={values.scope}
          labelKey="name"
          onSelect={(value) => setFieldValue('scope', value)}
          onTouch={setFieldTouched.bind(null, 'scope')}
          error={errors?.scope && touched?.scope && errors.scope}
        />

        <Input
          name="work_place"
          valueChange={(value) => {
            setFieldValue('work_place', value);
            delayedHandleChange(value);
          }}
          value={values.work_place}
          label="Место работы"
          description="Официальное название организации"
          onTouch={setFieldTouched.bind(null, 'work_place')}
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
        />

        <div className={styles.controlWithVisibilityCheckbox}>
          <Input
            name="work_position"
            valueChange={(value) => setFieldValue('work_position', value)}
            value={values.work_position}
            label="Должность"
            description="Ваша должность"
            onTouch={setFieldTouched.bind(null, 'work_position')}
            error={errors?.work_position && touched?.work_position && errors.work_position}
          />

          {!!values.is_public && values._selectFieldsToShow && (
            <div className={`${styles.visibilityCheckbox} form-group`}>
              <Checkbox
                value={values._fieldsForPublicShowHash.work_position || false}
                valueChange={(value) => setFieldValue('_fieldsForPublicShowHash.work_position', value)}
                name="_fieldsForPublicShowHash.work_position"
              />
            </div>
          )}
        </div>

        <br />
        <br />

        <EditUserEmail />

        <br />
        <br />

        <h3>пароль</h3>

        <Input
          name="password"
          type="password"
          valueChange={(value) => {
            setFieldValue('password', value, true);
          }}
          value={values.password}
          label="Пароль"
          autoComplete="new-password"
          description="Введите ваш пароль"
          onTouch={setFieldTouched.bind(null, 'password')}
          error={errors?.password && touched?.password && errors.password}
        />

        <Input
          name="_confirm_password"
          type="password"
          valueChange={(value) => {
            setFieldValue('_confirm_password', value, true);
            if (!touched._confirm_password) {
              setFieldTouched('_confirm_password');
            }
          }}
          value={values._confirm_password}
          label="Подтвердить пароль"
          description="Подтвердите пароль"
          onTouch={() => setFieldTouched('_confirm_password')}
          error={errors?._confirm_password && touched?._confirm_password && errors._confirm_password}
        />

        <div className="form-group form-actions">
          <Button onClick={() => validateForm().then(() => handleSubmit())} type="submit" maxWidth>
            Сохранить изменения
          </Button>
        </div>

        <div className="form-group form-actions">
          <Button color="light" onClick={onCancel} maxWidth>
            Отменить изменения
          </Button>
        </div>

        {/* <div className={`${styles.deleteProfile} form-group form-actions`}>
          <span onClick={onDeleteProfile}>Удалить профиль?</span>
        </div> */}
      </div>
    </div>
  );
}

// {/*<div className={styles.controlWithVisibilityCheckbox}>*/}
// {/*    */}
// {/*    {!!values.is_public && values._selectFieldsToShow && (*/}
// {/*        <div className={`${styles.visibilityCheckbox} form-group`}>*/}
// {/*            <Checkbox*/}
// {/*                value={values._fieldsForPublicShowHash.family || false}*/}
// {/*                valueChange={(value) => setFieldValue('_fieldsForPublicShowHash.family', value)}*/}
// {/*                name='_fieldsForPublicShowHash.family'*/}
// {/*            />*/}
// {/*        </div>*/}
// {/*    )}*/}
// {/*</div>*/}
