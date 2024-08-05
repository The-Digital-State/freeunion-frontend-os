import React from 'react';
import styles from './SpinnerGlobal.module.scss';

export function SpinnerGlobal() {
  return (
    <div className={styles.SpinnerGlobal}>
      <div className={styles.spinner} />
    </div>
  );
}
