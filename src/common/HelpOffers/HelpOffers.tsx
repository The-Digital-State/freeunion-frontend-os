import { useContext, useEffect } from 'react';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { Button } from 'shared/components/common/Button/Button';

import styles from './HelpOffers.module.scss';

interface IHelpOffersProps {
  unionId: number;
  openHelpOffersModal: () => void;
}

export const helpOffersBlockId = 'help-offers';

const HelpOffers = ({ openHelpOffersModal, unionId }: IHelpOffersProps): JSX.Element => {
  const { helpOffers, user } = useContext(GlobalDataContext);

  useEffect(() => {
    helpOffers.getHelpOffers(unionId);
  }, [unionId]);

  // @ts-ignore
  const activeHelpOffers = (user.membership.find((org) => org.id === unionId)?.help_offers || []) as [];

  return (
    <div data-cy="ready-to-do" className={styles.helpOffers} id={helpOffersBlockId}>
      <ul className={styles.helpOffersInfo}>
        {!!activeHelpOffers.length &&
          activeHelpOffers.map((id) => {
            const offer = helpOffers?.data.find((i) => i.id === id)?.text;
            if (offer) {
              return <li key={id}>{offer}</li>;
            }
            return null;
          })}
      </ul>
      <div className={styles.wrapperButtonHelpOffers}>
        <h3>Выбери чем готов помочь своему объединению на пути к общим целям</h3>
        <Button data-cy="choose-help-btn" maxWidth onClick={openHelpOffersModal}>
          Выбрать помощь
        </Button>
      </div>
    </div>
  );
};

export default HelpOffers;
