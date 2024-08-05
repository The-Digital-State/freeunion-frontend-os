import React from 'react';

import { Icons } from './Icon.interface';
import { iconsConfig } from './Icons.config';
import classNames from 'classnames';

import './Icon.scss';

type IIconProps = {
  iconName: keyof typeof Icons;
  width?: number | string;
  height?: number | string;
  color?: 'primary' | 'secondary' | 'disabled' | 'black' | 'white';
  rotate?: number;
  className?: string;
};

export function Icon({ iconName, height, width, color, rotate, className }: IIconProps) {
  const icon = iconsConfig[iconName] || null;

  return icon?.icon
    ? React.createElement(
        icon.icon,
        {
          width: width ? width : icon.width,
          height: height ? height : icon.height,
          alt: iconName,
          className: classNames(color, className),
          style: { transform: `rotate(${rotate || 0}deg)` },
        },
        null
      )
    : null;
}
