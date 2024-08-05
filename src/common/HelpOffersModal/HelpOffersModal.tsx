import { Button } from 'shared/components/common/Button/Button';
import { Checkbox } from 'shared/components/common/Checkbox/Checkbox';
import { GlobalContext } from 'contexts/GlobalContext';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { cloneDeep } from 'lodash';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { userService } from 'services';
import formatServerError from 'utils/formatServerError';

import styles from './HelpOffersModal.module.scss';
import { UnionActionsKeys } from 'interfaces/user.interface';

function HelpOffersModal({ unionId }: { unionId: number }) {
  const { user, setUser, helpOffers, updateUnionActions } = useContext(GlobalDataContext);
  const {
    closeModal,
    screen: { innerWidth },
  } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);

  // @ts-ignore
  const userHelpOffers = user.membership.find((org) => org.id === unionId)?.help_offers || [];

  return (
    <div data-cy="help-offers-modal">
      <h3>Что готов делать</h3>

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          // @ts-ignore
          const data = Object.fromEntries(new FormData(event.target));
          const keys = Object.keys(data).map((key) => Number(key));

          try {
            setIsLoading(true);
            await userService.setHelpOffers(unionId, keys);

            const newUser = cloneDeep(user);

            // @ts-ignore
            newUser.membership.find((org) => org.id === unionId).help_offers = keys;

            setUser(newUser);
            toast('Помощь обновлена');

            updateUnionActions(unionId, UnionActionsKeys.chooseHelpOffers, true);

            closeModal();
          } catch (error) {
            toast.error(formatServerError(error));
          }

          setIsLoading(false);
        }}
      >
        <div className={styles.offers}>
          {helpOffers.data.map(({ id, text }) => {
            return (
              <Checkbox
                type="small"
                key={id}
                valueChange={() => {}}
                label={text}
                value={userHelpOffers.includes(id)}
                name={id}
                className={styles.checkboxHelpOffers}
              />
            );
          })}
        </div>
        <Button type="submit" disabled={isLoading} maxWidth={innerWidth < 765}>
          Готов
        </Button>
      </form>
    </div>
  );
}

export default HelpOffersModal;
