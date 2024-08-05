import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from './SuggestionsList.module.scss';
import { ISuggestion, SuggestionVotesVariant } from '../../../interfaces/suggestion.interface';
import { Icon } from '../../../shared/components/common/Icon/Icon';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { Link, useHistory } from 'react-router-dom';

import useDebounce from '../../../hooks/useDebounce';
import { GlobalDataContext } from '../../../contexts/GlobalDataContext';
import { routes } from 'Routes';

type ISuggestionsListProps = {
  suggestionsList: ISuggestion[];
  setHoveredSuggestion: (suggestion: ISuggestion) => void;
  voteStatusChanged: (suggestion: ISuggestion) => void;
  setSuggestionEdit?: (suggestion: ISuggestion) => void;
  type: 'all' | 'my' | 'archive';
};

export function SuggestionsList({ suggestionsList, setHoveredSuggestion, voteStatusChanged, type }: ISuggestionsListProps) {
  const {
    services: { deviceService, scrollService },
  } = useContext(GlobalContext);
  const { selectedOrganisationId } = useContext(GlobalDataContext);
  const history = useHistory();

  const suggestionsListRef = useRef();
  const scrollContainerRef = useRef();

  const [scrollButtonsState, setScrollButtonsState] = useState<{ disableNext: boolean; disablePrev: boolean }>({
    disableNext: false,
    disablePrev: true,
  });

  const [scrollEvent, setScrollEvent] = useState<any>();
  const debounceScrollValue = useDebounce(scrollEvent, 100);

  useEffect(() => {
    if (debounceScrollValue) {
      const { scrollHeight, scrollTop, clientHeight } = debounceScrollValue?.target;

      setScrollButtonsState(scrollService.checkIfScrollIsAvailable(scrollHeight, scrollTop, clientHeight));
    }
  }, [debounceScrollValue]);

  const [showScrollButtons] = useState<boolean>(false);

  // useEffect(() => {
  //   if (deviceService.isMobile) {
  //     setTimeout(() => {
  //       setShowScrollButtonsState(scrollService.isScrollable(scrollContainerRef.current));
  //     });
  //   }
  // }, [suggestionsList]);

  const handleLike = (suggestion: ISuggestion) => {
    voteStatusChanged(suggestion);
  };

  let timeoutId;
  const handleMouseEnter = (suggestion) => {
    setHoveredSuggestion(suggestion);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const handleMouseOut = (event) => {
    if (event.currentTarget.contains(event.target)) {
      return;
    }
    timeoutId = setTimeout(() => {
      setHoveredSuggestion(null);
    }, 500);
  };

  const goToSuggestion = (suggestion: ISuggestion) => {
    history.push(`${routes.union.getLink(selectedOrganisationId)}/suggestionMobile/${type}/${suggestion.id}${history.location.search}`, {
      disableScroll: true,
    });
  };

  const doScroll = (direction: 'next' | 'prev') => {
    switch (direction) {
      case 'next': {
        scrollService.scrollNext(styles.scrollContainer, styles.suggestion, 3, 'vertical');
        break;
      }
      case 'prev': {
        scrollService.scrollPrev(styles.scrollContainer, styles.suggestion, 3, 'vertical');
        break;
      }
    }
  };

  return (
    <div className={`${styles.SuggestionsList}`} ref={suggestionsListRef}>
      {deviceService.isMobile && showScrollButtons && (
        <div
          className={`${styles.scrollButton} ${scrollButtonsState.disablePrev ? styles.disabled : ''}`}
          onClick={doScroll.bind(null, 'prev')}
        >
          <div></div>
          <Icon iconName="arrowBottom" rotate={180} />
        </div>
      )}
      <div
        className={`${styles.scrollContainer} ${showScrollButtons ? styles.withScrollButtons : ''} custom-scroll custom-scroll-black`}
        onScroll={setScrollEvent}
        ref={scrollContainerRef}
      >
        {!(suggestionsList || []).length && (
          <div>
            {type === 'archive' && 'Архивных '}
            {type === 'my' && 'Моих '}
            {type === 'all' ? 'Предложений' : 'предложений'} нет
          </div>
        )}

        {(suggestionsList || []).map((suggestion) => (
          <div
            className={`${styles.suggestion} ${!!suggestion.my_reaction ? styles.voted : ''}`}
            key={suggestion.id}
            data-suggestion-id={suggestion.id}
            onMouseEnter={!deviceService.isMobile ? handleMouseEnter.bind(null, suggestion) : null}
            onMouseOut={!deviceService.isMobile ? handleMouseOut.bind(null) : null}
            onClick={deviceService.isMobile ? goToSuggestion.bind(null, suggestion) : null}
          >
            <div className={styles.icon} onClick={handleLike.bind(null, suggestion)}>
              <Icon
                iconName="like"
                color={!!suggestion.my_reaction && suggestion.my_reaction === SuggestionVotesVariant.thumbs_up ? 'primary' : 'disabled'}
              />
            </div>
            <div className={styles.likesCount}>
              <span>{suggestion.count}</span>
            </div>
            {deviceService.isMobile ? (
              <div className={styles.suggestionText}>{suggestion.title}</div>
            ) : (
              <Link className={styles.suggestionText} to={routes.suggestion.getLink(suggestion?.organization_id, suggestion?.id)}>
                {suggestion.title}
              </Link>
            )}
          </div>
        ))}
      </div>

      {deviceService.isMobile && showScrollButtons && (
        <div
          className={`${styles.scrollButton} ${scrollButtonsState.disableNext ? styles.disabled : ''}`}
          onClick={doScroll.bind(null, 'next')}
        >
          <div></div>
          <Icon iconName="arrowBottom" />
        </div>
      )}

      {!suggestionsList?.length ? <p>Предложений нет</p> : false}
    </div>
  );
}
