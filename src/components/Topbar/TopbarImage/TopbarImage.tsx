import React from 'react';
import styles from './TopbarImage.module.scss';
import telegramIcon from '../../../public/telegram.svg';

type ITopbarImageProps = {
  src: string;
  alt: string;
  displayTelegramIcon?: boolean;
};
export function TopbarImage({ src, alt = '', displayTelegramIcon = true }: ITopbarImageProps) {
  return (
    <div className={styles.TopbarImage}>
      <div className={styles.socialNetwork}>{displayTelegramIcon && <img src={telegramIcon} alt="" />}</div>
    </div>
  );
}
