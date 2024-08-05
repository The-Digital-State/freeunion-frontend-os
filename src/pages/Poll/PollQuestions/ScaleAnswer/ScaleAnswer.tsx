import React, { useMemo, useState } from 'react';
import styles from './ScaleAnswer.module.scss';
import { AnswerProps } from '../PollQuestions';
import { Icon } from 'shared/components/common/Icon/Icon';
import cn from 'classnames';

const ScaleAnswer = ({ settings, answer, setAnswer }: AnswerProps) => {
  const [hoverValue, setHoverValue] = useState(undefined);
  let scaleArray = useMemo(() => {
    return Array(Number(settings.max_value) - Number(settings.min_value) + 1)
      .fill(undefined)
      .map((_, index) => index + Number(settings.min_value));
  }, [settings]);

  return (
    <div className={styles.main}>
      <div className={styles.wrapper}>
        {scaleArray.map((property) => {
          return (
            <div className={styles.wrapperStar}>
              <button
                onMouseEnter={() => setHoverValue(property)}
                onMouseLeave={() => setHoverValue(undefined)}
                className={cn(styles.wrapperIcon, {
                  [styles.isActive]: property <= answer || property <= hoverValue,
                })}
                onClick={() => setAnswer(property)}
              >
                <Icon iconName="star" />
              </button>

              <span>{property}</span>
            </div>
          );
        })}
      </div>
      <span className={styles.textMinMax}>
        {!!settings.min_name && `от ${settings.min_name}`} {!!settings.max_name && `до ${settings.max_name}`}
      </span>
    </div>
  );
};

export default ScaleAnswer;
