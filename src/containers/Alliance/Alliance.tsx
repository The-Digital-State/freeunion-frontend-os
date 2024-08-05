import { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { routes } from 'Routes';
import { useSsrEffect, useSsrState } from '@issr/core';
import cn from 'classnames';
import formatServerError from 'utils/formatServerError';
import KnowledgeBaseTabs from 'components/KnowledgeBaseTabs/KnowledgeBaseTabs';
import HelpOffers from 'common/HelpOffers/HelpOffers';
import HelpOffersModal from 'common/HelpOffersModal/HelpOffersModal';
import WelcomeActions from 'common/WelcomeActions/WelcomeActions';
import { ISuggestion } from 'interfaces/suggestion.interface';
import { SuggestionForm } from 'components/Suggestions/SuggestionForm/SuggestionForm';
import SuggestionsTabs from 'components/SuggestionsTabs/SuggestionsTabs';
import { Kanban } from 'containers/Kanban/Kanban';
import { unionPage } from 'constans/cypress';
import ChatButton, { handleChatClick } from 'common/ChatButton/ChatButton';
import NewsGroupContainer, { NewsDataTypes } from 'pages/News/NewsGroupContainer/NewsGroupContainer';
import { Button } from 'shared/components/common/Button/Button';
import Finance from 'components/Finance/Finance';
import Subscriptions from 'components/Subscriptions/Subscriptions';
import ReasonLeaveOrganization from 'components/Modals/ReasonLeaveOrganization/ReasonLeaveOrganization';
import styles from './Alliance.module.scss';
import { AllianceInfo } from './AllianceInfo/AllianceInfo';
import { Hierarchy } from './Hierarchy/Hierarchy';
import { Members } from './Members/Members';
import topBarStyles from '../../components/Topbar/Topbar.module.scss';
import { Topbar } from '../../components/Topbar/Topbar';
import { GlobalContext } from '../../contexts/GlobalContext';
import { GlobalDataContext } from '../../contexts/GlobalDataContext';
import { EnterOrganizationStatuses, Hiddens, IOrganisation, IOrganizationEnterRequest } from '../../interfaces/organisation.interface';
import TopBarActionButton from 'components/Topbar/TopBarActionButton/TopBarActionButton';
import SuggestionButton from 'common/SuggestionButton/SuggestionButton';
import PollsTabs from 'components/PollsTabs/PollsTabs';

export function Alliance() {
  const history = useHistory();
  const location = useLocation();
  const {
    openModal,
    services: { organisationsService },
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);

  let { id } = useParams<{ id: string | undefined }>();

  if (location.pathname.includes('/free-union')) {
    id = process.env.REACT_APP_ORG_FU;
  }

  const { user, selectedOrganisation, selectOrganisation, updateUnionActions } = useContext(GlobalDataContext);
  const [organisation, setOrganisation] = useSsrState<IOrganisation>(null);
  const [requestStatus, setRequestStatus] = useSsrState<IOrganizationEnterRequest | null>(null);
  const [suggestionBlockIsActive, setSuggestionBlockStatus] = useState<boolean>(false);
  const [suggestionEdit, setSuggestionEdit] = useState<ISuggestion | null>();

  const isLoggedIn = !!user;

  const membership = user?.membership || [];

  const getOrganisation = async (organisationId: number) => {
    try {
      const organisation = await organisationsService.getOrganisationById(organisationId);
      setOrganisation(organisation);
    } catch (error) {
      console.log(error);
      toast.error(formatServerError(error.data));
    }
  };

  const getOrganizationEnterRequest = async (id: number) => {
    try {
      const enterRequestStatus = await organisationsService.getOrganizationEnterRequestById(id);

      setRequestStatus(enterRequestStatus);
    } catch (e) {
      if (e.request.status === 404) {
        setRequestStatus(null);
        return;
      }
      toast.error(formatServerError(e));
    }
  };

  function openHelpOffersModal() {
    openModal({
      params: {
        mainContainer: <HelpOffersModal unionId={selectedOrganisation.id} />,
      },
    });
  }

  useEffect(() => {
    (async () => {
      if (!id) {
        setOrganisation(null);
        return;
      }
      showSpinner();
      await Promise.all([getOrganisation(+id), isLoggedIn ? getOrganizationEnterRequest(+id) : undefined]);

      hideSpinner();
    })();
  }, [id, isLoggedIn]);

  useSsrEffect(async () => {
    // later add getOrganizationEnterRequest for ssr
    await Promise.all([getOrganisation(+id)]);
  });

  useEffect(() => {
    if (isLoggedIn && id && membership.find((org) => org.id === +id)) {
      selectOrganisation(+id);
    }
  }, [id, membership, isLoggedIn]);

  useEffect(() => {
    if (!id && selectedOrganisation?.id) {
      history.push(routes.union.getLink(selectedOrganisation.id));
    }
  }, [id, selectedOrganisation]);

  useEffect(() => {
    if (suggestionBlockIsActive) {
      document.documentElement.classList.remove('autoscroll');
    } else {
      document.documentElement.classList.add('autoscroll');
      setSuggestionEdit(null);
    }
  }, [suggestionBlockIsActive]);

  const userInOrganisation = requestStatus?.status === EnterOrganizationStatuses.active;

  return (
    <>
      {organisation && (
        <Helmet>
          <title>{organisation ? organisation.short_name : 'Организация'}</title>

          <meta name="og:title" content={organisation.short_name} />
          <meta name="description" content={organisation.description || organisation.name} />
          <meta
            name="og:image"
            content={organisation.avatar || process.env.REACT_APP_BASE_URL + '/' + require('../../public/logo.jpg').default}
          />
        </Helmet>
      )}
      <div className={styles.Alliance}>
        {isLoggedIn && (
          <Topbar
            // leftContainer={leftContainer}
            rightContainer={
              userInOrganisation ? (
                <div className="p-left p-0-left-xl p-right p-0-right-md">
                  <ChatButton />
                  <Button
                    icon="userAdd"
                    to={routes.INVITE_COLLEAGUE}
                    dataCy={unionPage.inviteFriendBtn}
                    className={topBarStyles.inviteButton}
                  >
                    Пригласить друга
                  </Button>
                </div>
              ) : !id && !selectedOrganisation?.id ? (
                <div className="p-left p-0-left-xl p-right p-0-right-md">
                  <Button
                    icon="userAdd"
                    to={routes.INVITE_COLLEAGUE}
                    dataCy={unionPage.inviteFriendBtn}
                    className={topBarStyles.inviteButton}
                  >
                    Пригласить друга
                  </Button>
                  {!user?.membership.length && (
                    <Button color="light" to={routes.CREATE_UNION}>
                      Создать объединение
                    </Button>
                  )}
                </div>
              ) : !!organisation?.id ? (
                <TopBarActionButton
                  id={+id || selectedOrganisation.id}
                  userInOrganisation={userInOrganisation}
                  requestStatus={requestStatus}
                  setRequestStatus={setRequestStatus}
                />
              ) : (
                <div className="p-left p-right">
                  <Button
                    onClick={() => {
                      if (isLoggedIn) {
                        history.goBack();
                      } else {
                        history.push(routes.LOGIN);
                      }
                    }}
                    maxWidth
                  >
                    Назад
                  </Button>
                </div>
              )
            }
          />
        )}

        {selectedOrganisation && selectedOrganisation?.id === organisation?.id && (
          <div className={cn('p-left p-right', styles.mobilePadding)}>
            <WelcomeActions
              organisation={organisation}
              openHelpOffersModal={openHelpOffersModal}
              handleChatClick={() => handleChatClick(organisation, updateUnionActions, openModal)}
            />
          </div>
        )}
        {!!organisation?.id && (
          <div className={cn('p-left p-right', styles.mobilePadding)}>
            <AllianceInfo organisation={organisation} />
          </div>
        )}
        {!!organisation?.id && (
          <div className={cn('p-left p-right', styles.mobilePadding)}>
            <Hierarchy organisationId={+organisation?.id} />
          </div>
        )}

        {!!organisation?.id && !(organisation.hiddens.includes(Hiddens.members) && !userInOrganisation) && (
          <div className={cn('p-left p-right', styles.mobilePadding)}>
            <Members organisationId={+organisation?.id} />
          </div>
        )}

        {!user?.membership.length && !organisation?.id && !!isLoggedIn && (
          <div className={cn(styles.educationWrapper)}>
            <h3>
              Вы ещё не вступили ни в одно объединение и не создали своего. Чтобы разобраться, как вы можете это сделать - посмотрите видео
              ниже.
            </h3>
            <div className={styles.containerWrapper}>
              <figure className={styles.videoContainer}>
                <div className={styles.videoWrapper}>
                  <iframe
                    className={styles.education}
                    src="https://www.youtube.com/embed/HzRvokOcMi4"
                    title="Начало работы на сервисе freeunion.online"
                    //@ts-ignore
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
              </figure>
            </div>
          </div>
        )}

        {!!organisation?.id && (
          <div className={cn('p-left p-right', styles.mobilePadding)}>
            <NewsGroupContainer organisationId={organisation?.id} type={NewsDataTypes.organisationNews} />
            {isLoggedIn && userInOrganisation && (
              <div className={styles.suggestNews}>
                <Button to={routes.newsSuggest.getLink(organisation?.id)} className={styles.leaveBtn}>
                  Предложить новость
                </Button>
              </div>
            )}
          </div>
        )}

        {!!organisation?.id && !!userInOrganisation && (
          <div className={cn('p-left p-right', styles.mobilePadding)}>
            <PollsTabs organisationId={organisation?.id} />
          </div>
        )}

        {!!organisation?.id && (
          <div className={cn('p-left p-right', styles.mobilePadding)}>
            <KnowledgeBaseTabs organisationId={+organisation?.id} />
          </div>
        )}

        {!!organisation?.id && (
          <div className={cn('p-left p-right', styles.mobilePadding)}>
            <Subscriptions organisationId={+organisation?.id} />
          </div>
        )}

        {!!organisation?.id && (
          <div className={cn('p-left p-right', styles.mobilePadding)}>
            <Finance organisationId={+organisation?.id} />
          </div>
        )}

        {!!organisation?.id && userInOrganisation && (
          <div className={styles.suggestions}>
            {selectedOrganisation && (
              <div className={`${styles.tabsContainer} p-left-md p-right-md`}>
                {suggestionBlockIsActive ? (
                  <SuggestionForm setSuggestionBlockStatus={setSuggestionBlockStatus} suggestionEdit={suggestionEdit} />
                ) : (
                  <SuggestionsTabs
                    setSuggestionEdit={setSuggestionEdit}
                    setSuggestionBlockStatus={setSuggestionBlockStatus}
                    selectedOrganisationId={organisation?.id}
                    userMembership={user?.membership}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {!!organisation?.id && userInOrganisation && !suggestionBlockIsActive && (
          <div className={styles.wrapperSuggestionButton}>
            <SuggestionButton setSuggestionBlockStatus={setSuggestionBlockStatus} />
          </div>
        )}

        {organisation && !!organisation?.id && !(organisation.hiddens.includes(Hiddens.tasks) && !userInOrganisation) && (
          <div className={cn('p-left p-right', styles.mobilePadding)}>
            <div className={styles.organisationUsers}>
              <h2>Задачи</h2>
              <Kanban orgId={`${organisation?.id}`} />
            </div>
          </div>
        )}
        {!!organisation?.id && selectedOrganisation && userInOrganisation && (
          <div
            className={cn('p-left p-right', styles.mobilePadding)}
            style={{
              marginTop: 5,
            }}
          >
            <HelpOffers unionId={organisation?.id} openHelpOffersModal={openHelpOffersModal} />
          </div>
        )}

        {/* <NextSteps type="alliance" /> */}

        {!!organisation?.id && userInOrganisation && (
          <div className={cn(styles.leaveButton, 'p-left p-right ')}>
            <Button
              color="light"
              className={styles.leaveBtn}
              dataCy="leave-organization"
              onClick={() =>
                openModal({
                  params: {
                    mainContainer: (
                      <ReasonLeaveOrganization
                        organisationId={+organisation?.id}
                        onSuccess={() => {
                          setRequestStatus(null);
                        }}
                      />
                    ),
                  },
                })
              }
            >
              Выйти из объединения
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
