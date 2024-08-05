import React, { useEffect, useState, useContext } from 'react';
import styles from './Profile.module.scss';
import { SuggestionForm } from '../../components/Suggestions/SuggestionForm/SuggestionForm';
import { GlobalContext } from '../../contexts/GlobalContext';
import { Topbar } from '../../components/Topbar/Topbar';
import { Button } from '../../shared/components/common/Button/Button';
import { Helmet } from 'react-helmet';

import { ISuggestion } from '../../interfaces/suggestion.interface';
import { IOrganisation } from '../../interfaces/organisation.interface';
import { GlobalDataContext } from '../../contexts/GlobalDataContext';
import { useHistory } from 'react-router-dom';
import { routes } from 'Routes';
import { toast } from 'react-toastify';
import formatServerError from 'utils/formatServerError';
import WelcomeActions from 'common/WelcomeActions/WelcomeActions';
import { Kanban } from 'containers/Kanban/Kanban';
import HelpOffers from 'common/HelpOffers/HelpOffers';
import HelpOffersModal from '../../common/HelpOffersModal/HelpOffersModal';
import ChatButton, { handleChatClick } from 'common/ChatButton/ChatButton';
import NewsGroupContainer from 'pages/News/NewsGroupContainer/NewsGroupContainer';
import { LaborUnionInfo } from 'common/LaborUnioniInfo/LaborUnionInfo';
import { dashboardPage } from 'constans/cypress';
import Subscriptions from 'components/Subscriptions/Subscriptions';
// import Feedback, { checkIfShowFeedbackModal } from 'shared/components/modals/Feedback/Feedback';
import topBarStyles from '../../components/Topbar/Topbar.module.scss';
import SuggestionsTabs from 'components/SuggestionsTabs/SuggestionsTabs';

// type IProfileProps = {};

export function Profile() {
  const {
    applyToOrganizationIconRef,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    services: { suggestionsService, organisationsService, deviceService, dictionariesService },
    spinner: { showSpinner, hideSpinner },
    openModal,
  } = React.useContext(GlobalContext);

  const { user, selectedOrganisation, updateUnionActions } = useContext(GlobalDataContext);

  const history = useHistory();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [organisation, setOrganisation] = useState<IOrganisation>();
  const [applyToOrganizationIsDisplayed, setApplyToOrganizationState] = useState<boolean>(false);
  const [suggestionBlockIsActive, setSuggestionBlockStatus] = useState<boolean>(false);
  const [suggestionEdit, setSuggestionEdit] = useState<ISuggestion | null>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMembership, setIsMembershipStatus] = useState<boolean>(false);

  useEffect(() => {
    applyToOrganizationIconRef?.current && applyToOrganizationIconRef.current.addEventListener('click', toggleApplyToOrganization);

    if (deviceService.isMobile) {
      document.documentElement.classList.add('autoscroll');
    }

    return () => {
      applyToOrganizationIconRef?.current?.removeEventListener('click', toggleApplyToOrganization);
      document.documentElement.classList.remove('autoscroll');
    };
  }, []);
  const getOrganisation = async (organisationId: number) => {
    showSpinner();

    try {
      const organisation = await organisationsService.getOrganisationById(organisationId);

      setOrganisation(organisation);
    } catch (error) {
      toast.error(formatServerError(error));
    }
    hideSpinner();
  };

  useEffect(() => {
    if (selectedOrganisation) {
      getOrganisation(selectedOrganisation.id);
      // setUserInOrganisationStatus(checkIfUserInOrganisation(user, selectedOrganisation.id));
    }
  }, [selectedOrganisation]);

  // const checkIfUserInOrganisation = (user: IUser, organisationId: number): boolean => {
  //     return !!user?.membership.find(organisation => organisation.id === organisationId) || false
  // }

  useEffect(() => {
    if (suggestionBlockIsActive) {
      document.documentElement.classList.remove('autoscroll');
    } else {
      document.documentElement.classList.add('autoscroll');
      setSuggestionEdit(null);
    }
  }, [suggestionBlockIsActive]);

  const toggleApplyToOrganization = () => {
    setApplyToOrganizationState(!applyToOrganizationIsDisplayed);
  };

  const openInviteColleagueModal = () => {
    history.push(routes.INVITE_COLLEAGUE + history.location.search, {
      invitationType: 'personal',
    });
  };

  function openHelpOffersModal() {
    openModal({
      params: {
        mainContainer: <HelpOffersModal unionId={selectedOrganisation.id} />,
      },
    });
  }

  return (
    <>
      <Helmet>
        <title>Моя страница</title>
      </Helmet>
      <Topbar
        // leftContainer={selectedOrganisation ? leftContainer : undefined}
        rightContainer={
          <div className="p-left p-0-left-xl p-right p-0-right-md">
            <Button
              icon="userAdd"
              dataCy={dashboardPage.inviteFriendBtn}
              onClick={openInviteColleagueModal}
              className={topBarStyles.inviteButton}
            >
              Пригласить друга
            </Button>
            {!user.membership.length && (
              <Button color="light" to={routes.CREATE_UNION}>
                Создать объединение
              </Button>
            )}
            {!!selectedOrganisation?.chats.length && <ChatButton />}
          </div>
        }
      />
      {selectedOrganisation && (
        <div className="p-left p-right">
          <LaborUnionInfo noLogo={!deviceService.isMobile} organisation={selectedOrganisation} />
        </div>
      )}
      {selectedOrganisation && (
        <div className={styles.WelcomeActions}>
          <div className="p-left p-right">
            <WelcomeActions
              organisation={selectedOrganisation}
              openHelpOffersModal={openHelpOffersModal}
              handleChatClick={() => handleChatClick(selectedOrganisation, updateUnionActions, openModal)}
            />
          </div>
        </div>
      )}

      <div className={styles.Profile}>
        {selectedOrganisation && (
          <div className={`${styles.tabsContainer} p-left-md p-right-md`}>
            {suggestionBlockIsActive ? (
              <SuggestionForm setSuggestionBlockStatus={setSuggestionBlockStatus} suggestionEdit={suggestionEdit} />
            ) : (
              <SuggestionsTabs
                setSuggestionEdit={setSuggestionEdit}
                setSuggestionBlockStatus={setSuggestionBlockStatus}
                selectedOrganisationId={selectedOrganisation.id}
                userMembership={user.membership}
              />
            )}
          </div>
        )}
      </div>

      {selectedOrganisation && (
        <div className="p-left p-right">
          <div className={styles.organisationUsers}>
            <h2>Задачи</h2>
            <div className={styles.card}>
              <Kanban orgId={String(selectedOrganisation.id)} />
            </div>
          </div>
        </div>
      )}

      {selectedOrganisation && (
        <div
          className="p-left p-right"
          style={{
            marginTop: 5,
          }}
        >
          <HelpOffers unionId={selectedOrganisation.id} openHelpOffersModal={openHelpOffersModal} />
        </div>
      )}
      {selectedOrganisation && (
        <div className="p-left p-right">
          <NewsGroupContainer organisationId={selectedOrganisation.id} />
          <Button color="light" to={routes.newsSuggest.getLink(selectedOrganisation.id)}>
            Предложить новость
          </Button>
        </div>
      )}
      {selectedOrganisation && (
        <div className="p-left p-right">
          <Subscriptions organisationId={selectedOrganisation.id} />
        </div>
      )}

      {/* <NextSteps type="profile" /> */}
    </>
  );
}
