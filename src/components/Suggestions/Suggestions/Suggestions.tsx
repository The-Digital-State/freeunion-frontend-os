import React, { useContext, useEffect, useState } from 'react';
import styles from './Suggestions.module.scss';
import { ISuggestion } from '../../../interfaces/suggestion.interface';
import { SuggestionsList } from '../SuggestionsList/SuggestionsList';
import { GiveSuggestion } from '../GiveSuggestion/GiveSuggestion';
import { Route, Switch } from 'react-router-dom';
import { Suggestion } from '../Suggestion/Suggestion';

import { NoMoreSuggestions } from '../NoMoreSuggestions/NoMoreSuggestions';
import { GlobalDataContext } from '../../../contexts/GlobalDataContext';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { SuggestionDesktop } from '../SuggestionDesktop/SuggestionDesktop';
import { routes } from 'Routes';

type ISuggestionsProps = {
  type: 'all' | 'my' | 'archive';
  setSuggestionBlockStatus: (status: boolean) => void;
  suggestionsList: ISuggestion[];
  voteStatusChanged: (suggestion: ISuggestion) => void;
  deleteSuggestion: (suggestionId: ISuggestion) => void;
  setSuggestionEdit?: (suggestion: ISuggestion) => void;
};

export function Suggestions({
  suggestionsList = [],
  setSuggestionBlockStatus,
  type,
  voteStatusChanged,
  setSuggestionEdit,
  deleteSuggestion,
}: ISuggestionsProps) {
  const [hoveredSuggestion, setHoveredSuggestion] = useState<ISuggestion>();
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);
  const { selectedOrganisation } = useContext(GlobalDataContext);
  const {
    services: { deviceService },
  } = useContext(GlobalContext);

  useEffect(() => {
    switch (type) {
      case 'all': {
        setSuggestions([...suggestionsList.filter((suggestion) => !suggestion.is_closed).sort((a, b) => b.count - a.count)]);
        break;
      }
      case 'archive': {
        setSuggestions([...suggestionsList.filter((suggestion) => !!suggestion.is_closed)]);
        break;
      }
      case 'my': {
        setSuggestions(suggestionsList.filter((s) => s.owner && !s.is_closed));
        break;
      }
    }
  }, [suggestionsList, type]);

  return (
    <>
      <Switch>
        <Route exact={true} path={routes.union.getLink(selectedOrganisation.id)}>
          {/*{showSuggestions && (*/}
          <div className={`${styles.Suggestions} p p-large`}>
            {deviceService.isMobile && !suggestions.length && (
              <NoMoreSuggestions setSuggestionBlockStatus={setSuggestionBlockStatus} organisation={selectedOrganisation} />
            )}

            {(!deviceService.isMobile || !!suggestions.length) && (
              <>
                <SuggestionsList
                  suggestionsList={suggestions}
                  setHoveredSuggestion={setHoveredSuggestion}
                  voteStatusChanged={voteStatusChanged}
                  type={type}
                />
                <div className={styles.right}>
                  <div className={`${hoveredSuggestion ? '' : styles.collapsed} ${styles.suggestionInfo}`}>
                    <SuggestionDesktop
                      suggestion={hoveredSuggestion}
                      setSuggestionBlockStatus={setSuggestionBlockStatus}
                      setSuggestionEdit={setSuggestionEdit}
                      deleteSuggestion={deleteSuggestion}
                      setHoveredSuggestion={setHoveredSuggestion}
                    />
                  </div>
                  <div className={`${hoveredSuggestion ? styles.collapsed : ''} ${styles.suggest}`}>
                    <GiveSuggestion setSuggestionBlockStatus={setSuggestionBlockStatus} />
                  </div>
                </div>
              </>
            )}
          </div>
          {/*)}*/}
        </Route>
        <Route
          exact={true}
          path={`${routes.union.getLink(selectedOrganisation.id)}/suggestionMobile/:type/:suggestionId`}
          render={() => (
            <Suggestion
              voteStatusChanged={voteStatusChanged}
              setSuggestionBlockStatus={setSuggestionBlockStatus}
              suggestions={suggestions}
              setSuggestionEdit={setSuggestionEdit}
              deleteSuggestion={deleteSuggestion}
            />
          )}
        />
      </Switch>
    </>
  );
}
