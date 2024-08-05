import CircleButton from 'common/CircleButton/CircleButton';
import { Icons } from 'shared/components/common/Icon/Icon.interface';
import { IOrganisation } from 'interfaces/organisation.interface';
import { useContext, useEffect, useState } from 'react';
import styles from './WelcomeActions.module.scss';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { helpOffersBlockId } from 'common/HelpOffers/HelpOffers';

interface IWelcomeActionsProps {
  organisation: IOrganisation;
  openHelpOffersModal: () => void;
  handleChatClick: () => void;
}

type ActionButton = {
  text: string;
  iconName: keyof typeof Icons;
  onClick: () => void;
};

const WelcomeActions = ({ organisation, openHelpOffersModal, handleChatClick }: IWelcomeActionsProps): JSX.Element => {
  const [actions, setActions] = useState<ActionButton[]>([]);

  const { user } = useContext(GlobalDataContext);

  useEffect(() => {
    let actions: ActionButton[] = [];
    let currentUnionActions = user.settings.unionActions?.find((i) => i.organisationId === organisation.id) || {
      chooseHelpOffers: false,
      joinChat: false,
    };

    if (
      // @ts-ignore
      !user.membership.find((org) => org.id === organisation.id)?.help_offers?.length &&
      !currentUnionActions.chooseHelpOffers
    ) {
      actions.push({
        iconName: 'message' as keyof typeof Icons,
        text: 'выбери чем готов помочь',
        onClick: () => {
          const helpOffers = document.getElementById(helpOffersBlockId);
          helpOffers.scrollIntoView({ block: 'start', behavior: 'smooth' });

          setTimeout(() => {
            // UX
            // later maybe replace timeout to IntersectionObserver logic
            openHelpOffersModal();
          }, 500);
        },
      });
    }

    if (organisation?.chats?.length && !currentUnionActions.joinChat) {
      actions.push({
        iconName: 'star' as keyof typeof Icons,
        text: 'присоединись к чату',
        onClick: () => {
          handleChatClick();
        },
      });
    }

    setActions(actions);
  }, [user, organisation]);

  if (!actions.length) {
    return null;
  }

  return (
    <div className={styles.welcomeActions__wrapper}>
      <h3>
        Активно присоединяйтесь к жизни объединения <i>{organisation.name}</i>:
        <br /> приглашайте друзей, общайтесь в анонимных чатах, помогайте в меру своих возможностей
      </h3>
      <div className={styles.welcomeCircles}>
        {actions.map(({ iconName, text, onClick }) => {
          return <CircleButton key={text} iconName={iconName} text={text} onClick={onClick} />;
        })}
      </div>
    </div>
  );
};

export default WelcomeActions;
