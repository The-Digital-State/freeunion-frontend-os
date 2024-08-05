import { Button, ButtonColors } from 'shared/components/common/Button/Button';
import styles from './ReasonLeaveOrganization.module.scss';
import { TextArea } from '../../../shared/components/common/TextArea/TextArea';
import { Radio } from 'shared/components/common/Radio/Radio';
import * as Yup from 'yup';
import { Formik } from 'formik';

import { useContext } from 'react';
import { ValidatorsTypes } from 'shared/components/common/Validator/ValidatorsTextTemplates';
import { GlobalContext } from 'contexts/GlobalContext';
import { GlobalDataContext } from 'contexts/GlobalDataContext';

const reasons = [
  {
    id: 1,
    label: 'Нет активности в Объединении',
  },
  {
    id: 2,

    label: 'Не интересна тема деятельности Объединения',
  },
  {
    id: 3,

    label: 'Не согласен с решениями администратора Объединения',
  },
  {
    id: 4,

    label: 'Нет доверия к Объединению',
  },
  {
    id: 5,

    label: 'Своя версия (укажите)',
  },
];

const validationSchema = Yup.object().shape({
  reason: Yup.string().trim().required(ValidatorsTypes.required),
});

function ReasonLeaveOrganization({ organisationId, onSuccess }: { organisationId: number; onSuccess: () => void }) {
  const { closeModal, screen } = useContext(GlobalContext);

  const { organisationMethods } = useContext(GlobalDataContext);

  return (
    <div className={styles.wrapper}>
      <h3>Причина выхода</h3>

      <Formik
        initialValues={{ reason: '', anotherReason: '' }}
        validationSchema={validationSchema}
        // validate={(values) => {
        //     const { reason, anotherReason } = values;
        //     if (+values['reason'] === reasons[reasons.length - 1].id || !anotherReason) {
        //       return {
        //         anotherReason: 'error'
        //       };
        //     }
        // }}
        onSubmit={async (values) => {
          const { reason: reasonId, anotherReason } = values;

          if (+values['reason'] === reasons[reasons.length - 1].id && !anotherReason) {
            return; // TODO: handle validation
          }

          const reason = anotherReason || reasons.find((reason) => reason.id === +reasonId).label;

          await organisationMethods.leaveOrganisation(organisationId, reason);

          onSuccess();
          closeModal();
        }}
      >
        {({ errors, values, handleSubmit, setFieldValue }) => {
          return (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <Radio
                options={reasons}
                autoFocus
                error={errors['reason']}
                name="reason"
                value={values['reason']}
                valueChange={(value, name) => setFieldValue(name, value)}
              />

              {+values['reason'] === reasons[reasons.length - 1].id && (
                <TextArea
                  name="anotherReason"
                  label="Своя версия"
                  valueChange={(value, name) => {
                    setFieldValue(name, value);
                  }}
                  error={errors['anotherReason']}
                />
              )}

              <div className={styles.buttons}>
                <Button onClick={closeModal} maxWidth={screen.innerWidth < 570}>
                  Отменить
                </Button>
                <Button color={ButtonColors.danger} type="submit" maxWidth={screen.innerWidth < 570}>
                  Выйти из объединения
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}

export default ReasonLeaveOrganization;
