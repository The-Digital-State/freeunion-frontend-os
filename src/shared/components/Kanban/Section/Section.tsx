// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useState } from 'react';
import type { FC } from 'react';
import styles from './Section.module.scss';
import { ReactElement } from 'react';

interface Props {
  actions?: ReactElement,
  title: string;
}

const Section: FC<Props> = (props) => {
  const { actions, title, children } = props;
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.content}
      >
        <div
          className={styles.expandSection}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <p className={styles.title}>{title}</p>
          {/* <ExpandMoreIcon sx={isExpanded ? { transform: 'rotate(180deg)' } : {}} /> */}
        </div>
        <div style={{ flexGrow: 1 }} />
        {actions}
      </div>
      {isExpanded && children}
    </div>
  );
};

export default Section;
