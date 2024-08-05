import React from 'react';
import styles from './StepsProgressBar.module.scss';

type IStepsProgressBar = {
  stepNumber: number;
  stepsCount: number;
};
export function StepsProgressBar({ stepNumber = 1, stepsCount = 1 }: IStepsProgressBar) {
  const width = (stepNumber / stepsCount > 1 ? 1 : stepNumber / stepsCount) * 100;
  return (
    <div className={styles.StepsProgressBar}>
      <div className={styles.progressBar}>
        <span className={stepNumber >= stepsCount ? styles.full : null} style={{ width: `${width}%` }} />
      </div>
      <span className={styles.text}>
        {stepNumber}\{stepsCount}
      </span>
    </div>
  );
}
