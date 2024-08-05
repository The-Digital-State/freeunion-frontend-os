import React from 'react';
import styles from './Spinner.module.scss';

export function Spinner({ size, percent }: { size?: number; percent?: boolean }) {
  return (
    <div
      className={styles.spinner}
      style={{
        width: `${size}${percent ? '%' : 'px'}`,
      }}
    />
  );
}
