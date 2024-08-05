import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { routes } from 'Routes';
import { Button, ButtonColors } from 'shared/components/common/Button/Button';

import styles from './EnterButton.module.scss';

const EnterButton = ({ organisationId, publicStatus, maxWidth }: { organisationId: number; publicStatus: number; maxWidth?: boolean }) => {
  const { user, unionEnterRequests, organisationMethods } = useContext(GlobalDataContext);

  const userInOrganisation = user?.membership?.find((organisation) => organisation.id === organisationId);

  const requestToEnter = unionEnterRequests.data[organisationId];

  const history = useHistory();

  async function enterOrganization() {
    await organisationMethods.enterOrganisation(organisationId);

    history.push(routes.enterUnion.getLink(organisationId));
  }

  return (
    <>
      {(() => {
        let disabled = false;
        let to;
        let color;
        let text = '';
        let onClick;

        if ((user && !userInOrganisation && !requestToEnter) || [9, 20, 21].includes(requestToEnter?.status)) {
          onClick = enterOrganization;
          color = ButtonColors.primary;
          text = 'Вступить';
        } else if (requestToEnter?.status === 0 && publicStatus === 1) {
          disabled = true;
          text = 'Заявка на расмотрении';
        } else {
          to = routes.union.getLink(organisationId);
          text = 'Перейти';
        }

        return (
          <Button color={color} onClick={onClick} className={styles.button} disabled={disabled} to={to} maxWidth={maxWidth}>
            {text}
          </Button>
        );
      })()}
    </>
  );
};

export default EnterButton;
