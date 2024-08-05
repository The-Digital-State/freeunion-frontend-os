import React, { useContext, useEffect, useRef } from 'react';
import styles from './SuggestionForm.module.scss';
import { Button } from '../../../shared/components/common/Button/Button';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { GlobalDataContext } from '../../../contexts/GlobalDataContext';
import { ISuggestion } from '../../../interfaces/suggestion.interface';
import { ValidatorsTypes } from '../../../shared/components/common/Validator/ValidatorsTextTemplates';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Input } from '../../../shared/components/common/Input/Input';
import { Checkbox } from '../../../shared/components/common/Checkbox/Checkbox';
import { CloseButton } from 'common/CloseButton/CloseButton';
import { toast } from 'react-toastify';
import formatServerError from 'utils/formatServerError';
import 'react-quill/dist/quill.snow.css';
import { addGeneralImage } from 'services/general';
import { ReactComponent as AddIcon } from '../../../shared/icons/add-circle.svg';
import { cloneDeep } from 'lodash';
import { allowedSizeFiles, toLargeFileSize } from 'shared/constants/allowedFileSize';

type ISuggestionFormProps = {
  setSuggestionBlockStatus: (...params: any[]) => void;
  suggestionEdit?: ISuggestion;
};

const validationSchema = Yup.object().shape({
  title: Yup.string().trim().required(ValidatorsTypes.required),
  description: Yup.string().required(ValidatorsTypes.required),
  solution: Yup.string(),
  goal: Yup.string(),
  images: Yup.array(),

  _urgency: Yup.boolean(),
  urgency: Yup.string().when('_urgency', {
    is: true,
    then: Yup.string().trim().required(ValidatorsTypes.required),
    otherwise: Yup.string(),
  }),

  _budget: Yup.boolean(),
  budget: Yup.string().when('_budget', {
    is: true,
    then: Yup.string().trim().required(ValidatorsTypes.required),
    otherwise: Yup.string(),
  }),

  _legal_aid: Yup.boolean(),
  legal_aid: Yup.string().when('_legal_aid', {
    is: true,
    then: Yup.string().trim().required(ValidatorsTypes.required),
    otherwise: Yup.string(),
  }),

  _rights_violation: Yup.boolean(),
  rights_violation: Yup.string().when('_rights_violation', {
    is: true,
    then: Yup.string().trim().required(ValidatorsTypes.required),
    otherwise: Yup.string(),
  }),
});

let ReactQuill;

export function SuggestionForm({ setSuggestionBlockStatus, suggestionEdit }: ISuggestionFormProps) {
  const {
    spinner: { showSpinner, hideSpinner },
    services: { suggestionsService },
  } = useContext(GlobalContext);
  const imageInput = useRef(null);

  const { selectedOrganisationId, selectOrganisation } = useContext(GlobalDataContext);

  useEffect(() => {
    // not working with SSR
    // https://github.com/zenoamaro/react-quill/issues/389
    ReactQuill = require('react-quill');
  }, []);

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

  const handleImageInput = async (e, setFieldValue, images) => {
    if (e.target.files[0].size > allowedSizeFiles) {
      toast.error(toLargeFileSize);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = async () => {
      try {
        const copyValuesImages = cloneDeep(images);
        const image = await addGeneralImage(reader.result);
        copyValuesImages.push({ uuid: image[0].uuid, url: reader.result });
        setFieldValue('images', copyValuesImages);
        toast('Фото успешно добавлено');
      } catch (error) {
        toast.error(formatServerError(error));
        console.error(error);
      }
    };
  };

  const handleClick = () => {
    imageInput.current.click();
  };

  const submitSuggestion = async (suggestion: ISuggestion) => {
    try {
      showSpinner();
      if (!!suggestionEdit) {
        await suggestionsService.updateSuggestion(selectedOrganisationId, suggestion, suggestionEdit.id);
        toast('Предложение обновлено!');
      } else {
        const result = await suggestionsService.createSuggestion(selectedOrganisationId, suggestion);
        await suggestionsService.vote(result.id);
        toast('Предложение создано!');
      }

      setSuggestionBlockStatus(false);
      selectOrganisation(selectedOrganisationId);

      window.dataLayer.push({
        event: 'event',
        eventProps: {
          category: 'user',
          action: 'createSuggestion',
          value: selectedOrganisationId,
        },
      });
    } catch (e) {
      toast.error(formatServerError(e));
    } finally {
      hideSpinner();
    }
  };

  useEffect(() => {
    const element = document.getElementById('suggestion-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div id="suggestion-form" className={styles.SuggestionForm}>
      <h2>{!suggestionEdit ? 'предложение' : 'изменение предложения'}</h2>
      <CloseButton className={styles.close} onClick={setSuggestionBlockStatus.bind(null, false)} />
      <Formik
        enableReinitialize
        initialValues={
          {
            title: suggestionEdit?.title || '',
            description: suggestionEdit?.description || '',
            solution: suggestionEdit?.solution || '',
            goal: suggestionEdit?.goal || '',
            images: suggestionEdit?.images || [],
            _urgency: !!suggestionEdit?.urgency || false,
            urgency: suggestionEdit?.urgency || '',
            _budget: !!suggestionEdit?.budget || false,
            budget: suggestionEdit?.budget || '',
            _legal_aid: !!suggestionEdit?.legal_aid || false,
            legal_aid: suggestionEdit?.legal_aid || '',
            _rights_violation: !!suggestionEdit?.rights_violation || false,
            rights_violation: suggestionEdit?.rights_violation || '',
          } as ISuggestion
        }
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const suggestion = { ...values, images: values.images.map((img) => img.uuid) };
          Object.keys(suggestion).forEach((key) => {
            if (key[0] === '_') {
              delete suggestion[key];
            }
          });
          submitSuggestion(suggestion);
        }}
      >
        {(formProps) => (
          <>
            <div className={styles.container}>
              <h3>
                предложите инициативу своему объединению. Если она наберет много голосов поддержки, лидеры объединения возьмут её в работу.
              </h3>
              <Input
                {...defaultFormProps('title', formProps)}
                valueChange={(value) => {
                  formProps.setFieldValue('title', value);
                }}
                label="Заголовок"
                bgColor="white"
                placeholder="О чем пойдет речь"
              />
              {!!ReactQuill && (
                <div>
                  <ReactQuill
                    className={styles.editor}
                    onChange={(value) => {
                      formProps.setFieldValue('description', value);
                    }}
                    value={formProps.values.description}
                    placeholder="Опишите суть предложения"
                  />
                </div>
              )}

              <Input
                {...defaultFormProps('solution', formProps)}
                valueChange={(value) => {
                  formProps.setFieldValue('solution', value);
                }}
                label="Шаги"
                bgColor="white"
                placeholder="Перечислите действия, которые нужно предпринять, чтобы решить проблему"
                required={false}
              />

              <Input
                {...defaultFormProps('goal', formProps)}
                valueChange={(value) => {
                  formProps.setFieldValue('goal', value);
                }}
                label="Кому это поможет?"
                bgColor="white"
                placeholder="Кому и какую пользу это принесет?"
                required={false}
              />

              <div>
                <input
                  type="file"
                  ref={imageInput}
                  onChange={(e) => handleImageInput(e, formProps.setFieldValue, formProps.values.images)}
                  accept="image/png, image/jpeg, image/jpg"
                  style={{ display: 'none' }}
                />
                <div className={styles.imageInputsWrapper}>
                  <button onClick={handleClick} className={styles.addImageButton}>
                    <AddIcon />
                    <p>Добавить изображение</p>
                  </button>
                  {!!formProps.values.images.length &&
                    formProps.values.images.map((item) => {
                      return (
                        <div className={styles.imageWrapper}>
                          <img src={item.url} alt="" className={styles.image} />
                          <button
                            className={styles.icon}
                            onClick={() => {
                              const copyImagesValues = cloneDeep(formProps.values.images);
                              const filterImages = copyImagesValues.filter((image) => image.uuid !== item.uuid);
                              formProps.setFieldValue('images', filterImages);
                              toast('Фото удалено!');
                            }}
                          >
                            <AddIcon />
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className={styles.col}>
                <div>
                  <Checkbox
                    {...defaultFormProps('_urgency', formProps)}
                    valueChange={(value) => {
                      if (!value) {
                        formProps.setFieldValue('urgency', '');
                      }
                      formProps.setFieldValue('_urgency', value);
                    }}
                    label="Срочно"
                  />
                </div>
                <div>
                  {formProps.values._urgency && (
                    <Input
                      {...defaultFormProps('urgency', formProps)}
                      valueChange={(value) => {
                        formProps.setFieldValue('urgency', value);
                      }}
                      label="Укажите причину"
                      bgColor="white"
                    />
                  )}
                </div>
                <div>
                  <Checkbox
                    {...defaultFormProps('_budget', formProps)}
                    valueChange={(value) => {
                      if (!value) {
                        formProps.setFieldValue('budget', '');
                      }
                      formProps.setFieldValue('_budget', value);
                    }}
                    label="Нужны затраты денег объединения"
                  />
                </div>
                <div>
                  {formProps.values._budget && (
                    <Input
                      {...defaultFormProps('budget', formProps)}
                      valueChange={(value) => {
                        formProps.setFieldValue('budget', value);
                      }}
                      label="Примерный бюджет"
                      bgColor="white"
                    />
                  )}
                </div>
                <div>
                  <Checkbox
                    {...defaultFormProps('_legal_aid', formProps)}
                    valueChange={(value) => {
                      if (!value) {
                        formProps.setFieldValue('legal_aid', '');
                      }
                      formProps.setFieldValue('_legal_aid', value);
                    }}
                    label="Нужна юридическая помощь"
                  />
                </div>
                <div>
                  {formProps.values._legal_aid && (
                    <Input
                      {...defaultFormProps('legal_aid', formProps)}
                      valueChange={(value) => {
                        formProps.setFieldValue('legal_aid', value);
                      }}
                      label="Опишите помощь"
                      bgColor="white"
                    />
                  )}
                </div>
                <div>
                  <Checkbox
                    {...defaultFormProps('_rights_violation', formProps)}
                    valueChange={(value) => {
                      if (!value) {
                        formProps.setFieldValue('rights_violation', '');
                      }
                      formProps.setFieldValue('_rights_violation', value);
                    }}
                    label="Сообщите, если есть нарушение прав"
                  />
                </div>
                <div>
                  {formProps.values._rights_violation && (
                    <Input
                      {...defaultFormProps('rights_violation', formProps)}
                      valueChange={(value) => {
                        formProps.setFieldValue('rights_violation', value);
                      }}
                      label="Как нарушили"
                      bgColor="white"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className={`${styles.actions} p-top p-0-top-lg`}>
              <Button onClick={() => formProps.validateForm().then(() => formProps.handleSubmit())} disabled={!formProps.isValid}>
                {!suggestionEdit ? 'Предложить инициативу' : 'Изменить предложение'}
              </Button>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
}
