import React from 'react';
import styles from './Spinner.module.scss';

type ISpinnerProps = {
  color?: 'white' | 'grey' | 'red';
  size?: number;
};

export function Spinner({ color = 'red', size = 18 }: ISpinnerProps) {
  return (
    <div className={styles.SpinnerContainer}>
      <div className={`${styles.Spinner} ${color}`} style={{ width: size, height: size }} />
    </div>
  );
}
