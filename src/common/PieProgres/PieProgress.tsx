import React from 'react';
import './PieProgres.scss';
import { Icon } from '../../shared/components/common/Icon/Icon';

type IPieProgressProps = {
  progress?: number;
  height?: number;
  width?: number;
};

export function PieProgress({ progress = 0, height = 100, width = 100 }: IPieProgressProps) {
  const size = Math.min(height, width);
  const r = size;
  const c = Math.PI * (r * 2);
  const value = isNaN(progress) ? 100 : progress < 0 ? 0 : progress > 100 ? 100 : progress;
  const strokeDashoffset = ((100 - value) / 100) * c;

  return (
    <div id="cont" style={{ width: size, height: size }}>
      <svg id="svg" width={size} height={size} viewBox={`0 0 ${size * 2} ${size * 2}`} version="1.1" xmlns="http://www.w3.org/2000/svg">
        <circle
          r={r}
          cx={size}
          cy={size}
          fill="transparent"
          strokeDasharray={c}
          strokeDashoffset="0"
          style={{ transformOrigin: `${size}px ${size}px` }}
        />
        <circle
          id="bar"
          r={r}
          cx={size}
          cy={size}
          fill="transparent"
          strokeDasharray={c}
          strokeDashoffset="0"
          style={{
            strokeDashoffset: strokeDashoffset,
            transformOrigin: `${size}px ${size}px`,
          }}
        />
      </svg>
      <span className="text text-bold">{value < 100 ? `${value}%` : <Icon iconName="check" width={18} />}</span>
    </div>
  );
}
