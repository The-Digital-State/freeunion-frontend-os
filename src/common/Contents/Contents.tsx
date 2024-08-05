import React, { useState } from 'react';
import styles from './Contents.module.scss';
import { Icon } from '../../shared/components/common/Icon/Icon';

export type IContent = {
  id: string;
  label: string;
};

type IContentsProps = {
  contents: IContent[];
};

const scrollToId = (id: string, event) => {
  event.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export function Contents({ contents }: IContentsProps) {
  const [isTableOfContentsExpanded, setTableOfContentsExpandedStatus] = useState<boolean>(false);

  return (
    <div className={styles.Contents}>
      <h3 className={styles.tableOfContentsHeading} onClick={setTableOfContentsExpandedStatus.bind(null, !isTableOfContentsExpanded)}>
        <span>Оглавление</span>
        <Icon iconName={isTableOfContentsExpanded ? 'arrowBottom' : 'arrowRight'} />
      </h3>
      <ul className={`${styles.tableOfContents} ${isTableOfContentsExpanded ? styles.expanded : ''} p-left p-right`}>
        {contents.map((content) => (
          <li key={content.id}>
            <a href="#" onClick={scrollToId.bind(null, content.id)}>
              {content.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
