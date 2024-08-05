import { Suggestions } from 'components/Suggestions/Suggestions/Suggestions';
import { GlobalContext } from 'contexts/GlobalContext';
import { IOrganisationShort } from 'interfaces/organisation.interface';
import { ISuggestion, SuggestionVotesVariant } from 'interfaces/suggestion.interface';
import { useContext, useEffect, useRef, useState } from 'react';
import { matchPath, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { routes } from 'Routes';
import { TabItem } from 'shared/components/common/Tabs/TabItem';
import { Tabs } from 'shared/components/common/Tabs/Tabs';
import formatServerError from 'utils/formatServerError';

const tabsConfig: { id: number; label: string; type: 'all' | 'my' | 'archive' }[] = [
  { id: 1, label: 'Актуальные', type: 'all' },
  { id: 2, label: 'Мои', type: 'my' },
  { id: 3, label: 'Архив', type: 'archive' },
];

const SuggestionsTabs = ({
  setSuggestionEdit,
  setSuggestionBlockStatus,
  selectedOrganisationId,
  userMembership,
}: {
  setSuggestionEdit: (suggestionEdit: ISuggestion | null) => void;
  setSuggestionBlockStatus: (suggestion: boolean) => void;
  selectedOrganisationId: number;
  userMembership?: IOrganisationShort[];
}) => {
  const history = useHistory();
  const tabsRef = useRef();

  const [activeTab, setActiveTab] = useState<any>();
  const [activeTabId, setActiveTabId] = useState<string | number>();
  const [tabsInitialized, setTabsInitializedStatus] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    services: { suggestionsService },
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);

  useEffect(() => {
    (async () => {
      if (selectedOrganisationId && userMembership.find((org) => org.id === selectedOrganisationId)) {
        try {
          showSpinner();
          const suggestions = await suggestionsService.getSuggestions(selectedOrganisationId);
          setSuggestions(suggestions);

          if (history.location.pathname.includes(`${routes.union.getLink(selectedOrganisationId)}/suggestion`)) {
            history.replace(history.location.pathname);
          }
        } catch (e) {
          setSuggestions([]);
        } finally {
          hideSpinner();
        }
      } else {
        setSuggestions([]);
      }
    })();
  }, [selectedOrganisationId]);

  useEffect(() => {
    const matchPathResult = matchPath<{ type: string; suggestionId: string | 'no-more' }>(history.location.pathname, {
      path: `${routes.union.getLink(selectedOrganisationId)}/suggestion/:type/:suggestionId`,
    });
    if (matchPathResult?.params?.type) {
      setActiveTabId(tabsConfig.find((tabItem) => tabItem.type === matchPathResult.params.type).id);
    }
    setTabsInitializedStatus(true);
  }, []);

  useEffect(() => {
    const matchPathResult = matchPath<{ type: string; suggestionId: string | 'no-more' }>(history.location.pathname, {
      path: `${routes.union.getLink(selectedOrganisationId)}/suggestion/:type/:suggestionId`,
    });
    if (matchPathResult?.params?.type) {
      setTimeout(() => {
        // @ts-ignore
        tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [tabsRef.current, tabsInitialized]);

  const activeTabChanged = () => {
    if (history.location.pathname.includes(routes.union.getLink(selectedOrganisationId) + '/suggestion')) {
      history.replace(routes.union.getLink(selectedOrganisationId), {
        ...((history?.location?.state as object) || {}),
        disableScroll: true,
      });
    }
  };

  const deleteSuggestion = async (suggestion: ISuggestion) => {
    try {
      showSpinner();
      await suggestionsService.deleteSuggestion(suggestion.organization_id, suggestion.id);
      const filterSuggestions = suggestions.filter((s) => s.id !== suggestion.id);
      setSuggestions([...filterSuggestions]);
      toast.success('Предложение удалено!');
    } catch (e) {
      toast.error(formatServerError(e));
    } finally {
      hideSpinner();
    }
  };

  const onVoteStatusChange = async (suggestion: ISuggestion) => {
    showSpinner();
    const updatedSuggestion =
      !!suggestion.my_reaction && suggestion.my_reaction === SuggestionVotesVariant.thumbs_up
        ? await suggestionsService.unvote(suggestion.id)
        : await suggestionsService.vote(suggestion.id);
    const index = suggestions.findIndex((s) => s.id === updatedSuggestion.id);
    if (index > -1) {
      Object.assign(suggestions[index], updatedSuggestion);
      setSuggestions([...suggestions]);
    }
    hideSpinner();
  };

  if (!tabsInitialized) {
    return null;
  }

  return (
    <>
      <h2>Предложения</h2>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} activeTabChanged={activeTabChanged} ref={tabsRef}>
        {tabsConfig.map((tabItem) => (
          <TabItem label={tabItem.label} key={tabItem.id} active={activeTabId === tabItem.id}>
            <>
              <Suggestions
                type={tabItem.type}
                suggestionsList={suggestions}
                setSuggestionBlockStatus={setSuggestionBlockStatus}
                setSuggestionEdit={setSuggestionEdit}
                voteStatusChanged={onVoteStatusChange}
                deleteSuggestion={deleteSuggestion}
              />
            </>
          </TabItem>
        ))}
      </Tabs>
    </>
  );
};

export default SuggestionsTabs;
