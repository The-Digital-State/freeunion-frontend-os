import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './Suggestion.module.scss';
import { useParams, useHistory } from 'react-router-dom';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { ISuggestion } from '../../../interfaces/suggestion.interface';
import { Icon } from '../../../shared/components/common/Icon/Icon';
import { CustomImage } from '../../../common/CustomImage/CustomImage';

import { GlobalDataContext } from '../../../contexts/GlobalDataContext';
import { NoMoreSuggestions } from '../NoMoreSuggestions/NoMoreSuggestions';
import { suggestionsService } from '../../../services';
import { routes } from 'Routes';
import { SuggestionDescription } from '../SuggestionDescription/SuggestionDescription';
import { Button } from 'shared/components/common/Button/Button';
import SuggestionDoughnut from 'components/Suggestions/SuggestionDoughnut/SuggestionDoughnut';

type ISuggestionProps = {
  voteStatusChanged: (suggestion: ISuggestion) => void;
  setSuggestionBlockStatus: (status: boolean) => void;
  suggestions: ISuggestion[];
  setSuggestionEdit: (status: ISuggestion) => void;
  deleteSuggestion: (suggestion: ISuggestion) => void;
};

export function Suggestion({
  voteStatusChanged,
  setSuggestionBlockStatus,
  suggestions,
  setSuggestionEdit,
  deleteSuggestion,
}: ISuggestionProps) {
  const history = useHistory();

  const {
    services: { deviceService, userService },
  } = useContext(GlobalContext);
  const { selectedOrganisation } = useContext(GlobalDataContext);
  const { type, suggestionId } = useParams<{ type: string; suggestionId: string | 'no-more' }>();
  const [suggestion, setSuggestion] = useState<ISuggestion>(null);
  const [index, setIndex] = useState<number>(null);
  const [needSwipeTraining, setNeedSwipeTrainingStatus] = useState<boolean>(suggestionsService.needSuggestionSwipeTraining);

  const suggestionRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (suggestions?.length) {
      const index = suggestions.findIndex((s) => s.id === +suggestionId);
      setSuggestion(suggestions[index]);
      setIndex(index);
    }
  }, [history.location.state, suggestions]);

  const changeNeedSwipeTrainingStatus = () => {
    setNeedSwipeTrainingStatus(false);
    suggestionsService.needSuggestionSwipeTraining = undefined;
  };

  const setLastViewedSuggestion = () => {
    userService.setLastViewedSuggestion(suggestion, selectedOrganisation.id);
  };

  const goToNextSuggestion = (withLike: boolean = false) => {
    const index = suggestions.findIndex((s) => s.id === suggestion.id);
    if (!suggestion.my_reaction && withLike) {
      voteStatusChanged(suggestion);
    }
    if (type === 'new') {
      setLastViewedSuggestion();
    }
    if (index === suggestions.length - 1) {
      history.push(`${routes.union.getLink(selectedOrganisation.id)}/suggestionMobile/${type}/no-more`, {
        suggestions: [...suggestions],
        disableScroll: true,
      });
    } else {
      history.push(`${routes.union.getLink(selectedOrganisation.id)}/suggestionMobile/${type}/${suggestions[index + 1].id}`, {
        suggestions: [...suggestions],
        disableScroll: true,
      });
    }
  };

  const goToPreviousSuggestion = () => {
    if (!suggestion) return;
    const index = suggestions?.findIndex((s) => s.id === suggestion.id);
    if (index === 0) {
      history.push(routes.union.getLink(selectedOrganisation.id), {
        disableScroll: true,
      });
    } else {
      history.push(`${routes.union.getLink(selectedOrganisation.id)}/suggestionMobile/${type}/${suggestions[index - 1].id}`, {
        suggestions: [...suggestions],
        disableScroll: true,
      });
    }
  };

  const goTo = (direction: 'next' | 'prev' | 'like') => {
    setTransformTranslateX(direction === 'next' ? -100 : 100, '%');
    setTimeout(() => {
      if (needSwipeTraining) {
        changeNeedSwipeTrainingStatus();
      } else {
        ['next', 'like'].includes(direction) ? goToNextSuggestion(direction === 'like') : goToPreviousSuggestion();
      }
      setTransformTranslateX(0);
    }, 140);
  };

  const handleVote = () => {
    voteStatusChanged(suggestion);
  };

  // Work with swiping
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);
  const [isTouched, setIsTouched] = React.useState<boolean>(false);
  const minDistance = 75;

  useLayoutEffect(() => {
    setIsTouched(true);
  }, [suggestion]);

  const setTransformTranslateX = (x: number, units: '%' | 'px' = 'px') => {
    if (containerRef.current) {
      let deg;
      if (units === 'px') {
        deg = x / 20;
      }
      if (units === '%') {
        deg = Math.sign(x) * 10;
      }
      // @ts-ignore
      containerRef.current.style.transform = `translateX(${x}${units}) rotate(${deg}deg)`;
    }
  };

  const handleTouchStart = (e) => {
    setIsTouched(true);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setTransformTranslateX(touchEnd - touchStart);
  };

  const handleTouchEnd = (e) => {
    setIsTouched(false);

    const touchEnd = e.changedTouches[0].clientX;
    if (Math.abs(touchStart - touchEnd) >= minDistance) {
      touchStart < touchEnd ? goTo('like') : goTo('next');
      return;
    }

    setTouchEnd(touchEnd);
    setTransformTranslateX(0);
    setIsTouched(false);
  };

  if (suggestionId === 'no-more') {
    setTransformTranslateX(0);
    return (
      <div className={`${styles.Suggestion} ${styles.noMore} ${type === 'new' ? styles.withHeading : ''} p`} ref={suggestionRef}>
        {type === 'new' && (
          <div className={styles.heading}>
            <div className={styles.icon}>
              <Icon iconName="arrowLeft" color="disabled" />
            </div>
            <strong>Просмотрены все новые</strong>
            <div className={styles.icon}>
              <Icon iconName="arrowRight" color="disabled" />
            </div>
          </div>
        )}
        <div className={styles.container}>
          <NoMoreSuggestions organisation={selectedOrganisation} setSuggestionBlockStatus={setSuggestionBlockStatus} />
        </div>
      </div>
    );
  }

  if (!suggestion) {
    return <div className="no-data p" ref={suggestionRef}></div>;
  }

  if (needSwipeTraining) {
    return (
      <div
        className={`${styles.Suggestion} p-top p-bottom`}
        ref={suggestionRef}
        onTouchStart={deviceService.isMobile ? handleTouchStart : undefined}
        onTouchMove={deviceService.isMobile ? handleTouchMove : undefined}
        onTouchEnd={deviceService.isMobile ? handleTouchEnd : undefined}
      >
        <div className={`${styles.heading} p-left p-right`}>
          <div className={styles.icon}>
            <Icon iconName="arrowLeft" color={index === 0 ? 'disabled' : 'black'} />
          </div>
          <strong>0 / {suggestions.length}</strong>
          <div className={styles.icon}>
            <Icon iconName="arrowRight" color={index === suggestions.length ? 'disabled' : 'black'} />
          </div>
        </div>
        <div className={`${styles.container} ${isTouched ? styles.touched : ''} p-left p-right`} ref={containerRef}>
          <div className={`${styles.content} custom-scroll custom-scroll-black`}>
            <h3 className="text-neutral">Смахни вправо, чтобы проголосовать за предложение. Смахни влево, чтобы пропустить предложение.</h3>
            <br />
            <div className={`${styles.swipeIcon}`}>
              <Icon iconName="iconSwipeTraining" width={150} height={200} />
            </div>
          </div>
          <div className={styles.footer}>
            <div className={`${styles.like} ${styles.disabled}`}>
              <Icon iconName="like" color="white" width={20} height={30} />
            </div>
            <div className={styles.avatar}>
              <CustomImage src={suggestion.user.public_avatar} alt="Avatar" width={70} height={70} background="white" />{' '}
            </div>
            <div className={styles.next}>
              <Icon iconName="arrowRight" color="primary" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.Suggestion} p-top p-bottom`}
      ref={suggestionRef}
      onTouchStart={deviceService.isMobile ? handleTouchStart : undefined}
      onTouchMove={deviceService.isMobile ? handleTouchMove : undefined}
      onTouchEnd={deviceService.isMobile ? handleTouchEnd : undefined}
    >
      <div className={`${styles.heading} p-left p-right`}>
        <div className={styles.icon} onClick={goTo.bind(null, 'prev')}>
          <Icon iconName="arrowLeft" color={index === 0 ? 'disabled' : 'black'} />
        </div>
        <strong>
          {index + 1} / {suggestions.length}
        </strong>
        <div className={styles.icon} onClick={goTo.bind(null, 'next')}>
          <Icon iconName="arrowRight" color={index === suggestions.length ? 'disabled' : 'black'} />
        </div>
      </div>
      <div className={`${styles.container} ${isTouched ? styles.touched : ''} p-left p-right`} ref={containerRef}>
        <div className={`${styles.content} custom-scroll custom-scroll-black`}>
          <h3>{suggestion.title}</h3>
          <p style={{ color: '#828ecc' }}>Обсуждений: {suggestion?.comments_count}</p>
          <br />
          <div className={styles.doughnut}>
            {!!suggestion?.reactions && <SuggestionDoughnut votes={suggestion?.reactions} withoutLabel />}
          </div>
          <SuggestionDescription suggestion={suggestion} styles={styles} />
          <div className={styles.wrapperMoreButton}>
            <Button color="light" to={routes.suggestion.getLink(suggestion?.organization_id, suggestion?.id)} className={styles.buttonMore}>
              Подробнее
            </Button>
          </div>

          {suggestion?.owner && (
            <div className={styles.changeButton}>
              <button
                onClick={() => {
                  setSuggestionBlockStatus(true);
                  setSuggestionEdit(suggestion);
                }}
              >
                Изменить
              </button>
              <button
                onClick={() => {
                  const isDelete = window.confirm(`Вы действительно хотите удалить предложение "${suggestion.title}"?`);
                  if (isDelete) {
                    deleteSuggestion(suggestion);
                  }
                  goTo('next');
                }}
              >
                Удалить
              </button>
            </div>
          )}
        </div>
        <div className={styles.footer}>
          <div className={`${styles.like} ${!!suggestion.my_reaction ? styles.voted : ''}`} onClick={handleVote}>
            <Icon iconName="like" color={!!suggestion.my_reaction ? 'primary' : 'white'} width={20} height={30} />
            {!!suggestion.my_reaction && <strong className="highlight">{suggestion.count}</strong>}
          </div>
          <div className={styles.avatar}>
            <CustomImage src={suggestion.user.public_avatar} alt="Avatar" width={70} height={70} background="white" />{' '}
          </div>
          <div className={styles.next} onClick={goTo.bind(null, 'next')}>
            <Icon iconName="arrowRight" color="primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
