import { useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Button } from 'shared/components/common/Button/Button';
import { Radio } from 'shared/components/common/Radio/Radio';
import { ValidatorsTypes } from 'shared/components/common/Validator/ValidatorsTextTemplates';
import { GlobalContext } from 'contexts/GlobalContext';
import { TextArea } from 'shared/components/common/TextArea/TextArea';
import formatServerError from 'shared/utils/formatServerError';

const newsErrors = [
  {
    id: 1,
    label: 'Грамматическая ошибка',
  },
  {
    id: 2,
    label: 'Недостоверная информация',
  },
  {
    id: 3,
    label: 'Публикация носит оскорбительный характер или содержит неприемлемый контент',
  },
  {
    id: 4,
    label: 'Публикация является скрытой рекламой, носит коммерческий характер',
  },
];

const validationSchema = Yup.object().shape({
  error: Yup.string().trim().required(ValidatorsTypes.required),
  textError: Yup.string().trim().required(ValidatorsTypes.required),
});

const NewsErrorModal = ({ newsId, organisationId }: { newsId: number; organisationId: number }) => {
  const {
    closeModal,
    services: { organisationsService },
  } = useContext(GlobalContext);

  return (
    <>
      <Formik
        initialValues={{ error: 1, textError: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            const { error, textError } = values;
            await organisationsService.errorNews(newsId, error, textError);
            toast('Ошибка отправлена!');
            closeModal();
          } catch (e) {
            toast.error(formatServerError(e));
          }
        }}
      >
        {({ errors, touched, isSubmitting, dirty, isValid, values, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <h3>Выберите ошибку:</h3>
            <Radio
              options={newsErrors}
              autoFocus
              error={errors?.error && touched?.error && errors.error}
              name="error"
              value={values['error']}
              valueChange={(value, name) => setFieldValue(name, value)}
            />
            <TextArea
              name="textError"
              label="Поле для ввода комментария (обязательное)"
              valueChange={(value, name) => {
                setFieldValue(name, value);
              }}
              error={errors?.textError && touched?.textError && errors.textError}
            />

            <Button type="submit" disabled={isSubmitting || !isValid || !dirty}>
              Отправить
            </Button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default NewsErrorModal;
