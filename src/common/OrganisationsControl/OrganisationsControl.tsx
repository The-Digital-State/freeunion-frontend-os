import { useContext, useEffect, useRef, useState } from 'react';
import styles from './OrganisationsControl.module.scss';
import { CustomImage } from '../CustomImage/CustomImage';
import { Icon } from '../../shared/components/common/Icon/Icon';
import { debounce } from 'lodash';
import { GlobalContext } from '../../contexts/GlobalContext';
import { GlobalDataContext } from '../../contexts/GlobalDataContext';
import { useHistory } from 'react-router';
import { routes } from 'Routes';

type IOrganisationsControlProps = {
  onClick?: () => void;
  orientation?: 'vertical' | 'horizontal';
  compactMode?: boolean;
  bgColor?: 'white' | 'gray';
};

let debounceCallback = null;

function setDebounceCallback(callback) {
  debounceCallback = callback;
}

const callDebounceCallback = (name) => {
  debounceCallback && debounceCallback(name);
};
const runDebounceCallback = debounce(callDebounceCallback, 200);

export function OrganisationsControl({
  orientation = 'vertical',
  compactMode = true,
  onClick,
  bgColor = 'white',
}: IOrganisationsControlProps) {
  const {
    services: { scrollService },
  } = useContext(GlobalContext);

  const history = useHistory();

  const {
    selectedOrganisation,
    selectOrganisation,
    user: { membership: organisations },
  } = useContext(GlobalDataContext);

  const componentRef = useRef<HTMLDivElement>();
  const scrollContainerRef = useRef<HTMLDivElement>();
  const [showScrollButtons, setShowScrollButtonsState] = useState<boolean>(false);
  const [scrollButtonsState, setScrollButtonsState] = useState<{ disableNext: boolean; disablePrev: boolean }>({
    disableNext: false,
    disablePrev: true,
  });

  const checkIfScrollButtonsAreShown = () => {
    // Check if scroll buttons should be displayed
    if (scrollContainerRef?.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      const showScrollButtonsLocal = scrollHeight > clientHeight;
      if (showScrollButtons !== showScrollButtonsLocal) {
        setShowScrollButtonsState(showScrollButtonsLocal);
      }
    }
  };

  const onScroll = (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    const scrollState = { disableNext: false, disablePrev: false };

    if (scrollTop <= 1) {
      scrollState.disablePrev = true;
    }
    if (clientHeight + scrollTop >= scrollHeight - 1) {
      scrollState.disableNext = true;
    }

    setScrollButtonsState(scrollState);
  };

  useEffect(() => {
    checkIfScrollButtonsAreShown();
    // countScrollContainerHeight();
  }, [compactMode]);

  useEffect(() => {
    setDebounceCallback(onScroll);
  }, []);

  const printOrganisations = () => {
    if (!organisations?.length) {
      return false;
    }
    const organisationsLength = organisations.length;
    const minLength = 4;

    const organisationsList = [];

    if (selectedOrganisation) {
      organisationsList.push(selectedOrganisation);
    }

    organisationsList.push(...organisations.filter((o) => o.id !== selectedOrganisation?.id));

    const result = organisationsList
      .slice(0, compactMode && organisationsLength >= minLength ? minLength : undefined)
      .map((organisation, index) => {
        const size = compactMode && index ? 45 : 60;
        const selected = organisation.id === selectedOrganisation?.id;

        return (
          <div
            key={organisation.id}
            className={`${styles.organisation} ${selected ? styles.selected : ''} organisation`}
            style={{ zIndex: 1000 - index }}
            onClick={
              !compactMode && !selected
                ? () => {
                    selectOrganisation(organisation.id);
                    history.push(routes.union.getLink(organisation.id));
                  }
                : null
            }
          >
            <CustomImage
              src={organisation?.avatar}
              alt={organisation?.short_name}
              width={size}
              height={size}
              background={bgColor}
              errorImage="noImage"
            />
          </div>
        );
      });

    if (compactMode && organisationsLength > minLength) {
      result.push(
        <div key={'other'} className={`${styles.organisation}`} style={{ zIndex: 1 }}>
          <span>+{organisationsLength - minLength}</span>
        </div>
      );
    }

    return result;
  };

  const doScroll = (direction: 'next' | 'prev') => {
    direction === 'next'
      ? scrollService.scrollNext(styles.scrollContainer, styles.organisation, 2, 'vertical')
      : scrollService.scrollPrev(styles.scrollContainer, styles.organisation, 2, 'vertical');
  };

  return (
    <>
      <div
        className={`${styles.OrganisationsControl} ${
          orientation === 'vertical' ? styles.orientationVertical : styles.orientationHorizontal
        } ${compactMode ? styles.compactMode : ''}`}
        onClick={compactMode && onClick ? onClick : undefined}
        ref={componentRef}
      >
        {compactMode && orientation === 'vertical' && <h4 className={styles.name}>{selectedOrganisation?.short_name}</h4>}

        {showScrollButtons && !compactMode && (
          <div
            className={`${styles.scrollButton} ${styles.rotate} ${scrollButtonsState.disablePrev ? styles.disabled : ''}`}
            onClick={doScroll.bind(null, 'prev')}
          >
            <Icon iconName="arrowBottom" />
          </div>
        )}
        <div className={styles.scrollContainer} ref={scrollContainerRef} onScroll={runDebounceCallback}>
          {printOrganisations()}
        </div>

        {showScrollButtons && !compactMode && (
          <div
            className={`${styles.scrollButton} ${scrollButtonsState.disableNext ? styles.disabled : ''}`}
            onClick={doScroll.bind(null, 'next')}
          >
            <Icon iconName="arrowBottom" />
          </div>
        )}
      </div>
    </>
  );
}
