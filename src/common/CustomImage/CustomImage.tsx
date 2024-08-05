import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import styles from './CustomImage.module.scss';
import { Icon } from '../../shared/components/common/Icon/Icon';
import { Icons } from '../../shared/components/common/Icon/Icon.interface';

type IImageProps = {
  src: string | ArrayBuffer;
  alt: string;
  rounded?: boolean;
  width?: number | string;
  height?: number | string;
  background?: 'white' | 'gray';
  children?: any;
  errorImage?: keyof typeof Icons;
  className?: string;
};

export function CustomImage({
  src = '',
  alt,
  width = 160,
  height = 160,
  rounded = true,
  background = 'gray',
  children,
  errorImage = 'user',
  className,
}: IImageProps) {
  const [loadingError, serLoadingErrorState] = useState<boolean>(!src);

  useEffect(() => {
    serLoadingErrorState(false);
  }, [src]);

  const handleError = () => {
    serLoadingErrorState(true);
  };

  return (
    <div
      className={cn(styles.CustomImage, className, {
        [styles.round]: rounded,
        [styles.bgGray]: background === 'gray',
        [styles.bgWhite]: background === 'white',
      })}
      style={{ width, height }}
    >
      {loadingError ? (
        children ? (
          children
        ) : (
          <Icon iconName={errorImage} width={'50%'} height={'50%'} color="disabled" />
        )
      ) : (
        <img
          className={cn({
            [styles.round]: rounded,
          })}
          src={src as string}
          alt={alt}
          onErrorCapture={handleError}
        />
      )}
    </div>
  );
}
