import { useContext, useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { Icon } from 'shared/components/common/Icon/Icon';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { GlobalContext } from 'contexts/GlobalContext';

import alianceStyles from '../Alliance.module.scss';
import './Hierarchy.scss';

// TODO rewrite to read custom-scroll.scc file
const scrollStyles = `
:root {
  --gray-2: #dcdde3;
  --black: #171719;
  --white: #ffffff;
}


  .custom-scroll::-webkit-scrollbar {
    width: 10px;
    height: 10px;

    scrollbar-width: thin;
    scrollbar-color: var(--gray-2) white !important;
  }

  .custom-scroll > * {
    scrollbar-width: thin;
    scrollbar-color: var(--gray-2) white !important;
  }

  .custom-scroll.custom-scroll-black::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }

  .custom-scroll::-webkit-scrollbar-track {
    background-color: var(--white);
  }

  .custom-scroll::-webkit-scrollbar-thumb {
    background: var(--gray-2);
    border-radius: 0;
    border-color: white;
    border-style: solid;
    border-width: 3px;
  }

  .custom-scroll.custom-scroll-black::-webkit-scrollbar-thumb {
    background: var(--black) !important;
    border: none !important;
  }

  .custom-scroll::-webkit-scrollbar-thumb:hover {
    opacity: 0.1;
    border-width: 2.5px;
  }
`;

export function Hierarchy({ organisationId }: { organisationId: number }) {
  const [hierarchy, setHierarchy] = useState<any[]>([]);
  const { organisations } = useContext(GlobalDataContext);
  const {
    services: { organisationsService, deviceService },
    spinner: { showSpinner, hideSpinner },
  } = useContext(GlobalContext);

  const organisation = organisations?.find((org) => org.id === organisationId);

  const getOrganisationHierarchy = async (organisationId: number) => {
    showSpinner();
    let organisationHierarchy = await organisationsService.getOrganisationHierarchy(organisationId);

    // Set root organisation to first place
    const rootOrganisationIndex = organisationHierarchy.findIndex((o) => !o.parents?.length);
    const rootOrganisation = organisationHierarchy[rootOrganisationIndex];
    organisationHierarchy.splice(rootOrganisationIndex, 1);
    organisationHierarchy = [rootOrganisation, ...organisationHierarchy];

    const hierarchyHash: { [organisationId: number]: number } = {};
    organisationHierarchy.forEach((o, index) => {
      hierarchyHash[o.id] = index;
    });

    const hierarchy = [
      ['id', 'childLabel', 'parent', 'size', { role: 'style' }],
      ...organisationHierarchy.map((o, index) => {
        return [
          hierarchyHash[o.id],
          o.children?.length === 1 ? `${o.short_name} —` : o.short_name,
          o.parents?.length ? hierarchyHash[o.parents[0]] : -1,
          1,
          'black',
        ];
      }),
    ];

    setHierarchy(hierarchy);

    setTimeout(() => {
      addScrollToHierarchy();
    });

    hideSpinner();
  };

  useEffect(() => {
    getOrganisationHierarchy(organisationId);
  }, [organisationId]);

  const handleChartIsReady = () => {
    const rend = document.querySelector('.hierarchy__wraptable');
    const docIframe = rend.querySelector('iframe')?.contentDocument;
    const otherhead = docIframe.documentElement.getElementsByTagName('head')[0];
    const style = docIframe.createElement('style');
    style.innerText = scrollStyles;
    otherhead.appendChild(style);
  };

  if (!organisation) {
    return null;
  }

  if (hierarchy.length < 3) {
    // 2 items: headers and 1 organization, don't show this block
    return null;
  }

  return (
    <div>
      <h2>структура объединения</h2>
      <div className={alianceStyles.card} style={{ marginTop: 30 }}>
        <div className="hierarchy">
          <div className="hierarchy__wraptable">
            {hierarchy && (
              <Chart
                className="hierarchy__table"
                width="100%"
                height={deviceService.isMobile ? '60vh' : '450px'}
                chartType="WordTree"
                loader={<div>Загрузка...</div>}
                data={hierarchy}
                options={{
                  colors: ['black', 'black', 'black'],
                  backgroundColor: 'transparent',
                  wordtree: {
                    format: 'explicit',
                    type: 'suffix',
                  },
                  forceIFrame: true,
                }}
                rootProps={{ 'data-testid': '2' }}
                chartLanguage="RU"
                chartEvents={[{ eventName: 'ready', callback: handleChartIsReady }]}
              />
            )}
          </div>
          <div className="hierarchy__about">
            <div className="hierarchy__about-title">
              <Icon iconName={'group'} />
              <h3>объединение “{organisation.short_name}”</h3>
            </div>
            <span className="hierarchy__about-text">{organisation.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function addScrollToHierarchy() {
  const rend = document.querySelector('.hierarchy__wraptable');
  if (!rend) return;
  const rendWidth = rend.clientWidth;
  const docIframe = rend.querySelector('iframe')?.contentDocument;

  if (!docIframe) return;

  const svg = docIframe.querySelector('svg');

  if (!svg) return;

  const divSvg = svg.closest('div');
  const gWidth = docIframe.querySelector('g').getBoundingClientRect().width;
  if (rendWidth === gWidth) {
    divSvg.style.overflowX = 'hidden';
    divSvg.style.overflowY = 'hidden';
  } else {
    divSvg.style.overflowX = 'scroll';
    divSvg.style.overflowY = 'hidden';
  }
  divSvg.classList.add('custom-scroll');
  svg.style.width = `${gWidth}px`;
}
