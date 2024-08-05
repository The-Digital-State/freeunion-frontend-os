import React from 'react';
import styles from './NextSteps.module.scss';
import { Icons } from '../../../shared/components/common/Icon/Icon.interface';
import { Icon } from '../../../shared/components/common/Icon/Icon';

type INextStep = {
  id: string;
  label: string;
  description: string[];
  icon: keyof typeof Icons;
};
const profileSteps: INextStep[] = [
  {
    id: '1',
    label: 'ПРОЗРАЧНОЕ ГОЛОСОВАНИЕ',
    description: ['Решайте, чем займется ваше объединение, какие предложения возьметесь реализовывать'],
    icon: 'group',
  },
  {
    id: '2',
    label: 'События',
    description: ['Узнайте, что и где происходит. Планируйте мероприятия своего объединения'],
    icon: 'group',
  },
];

const allianceSteps: INextStep[] = [
  {
    id: '1',
    label: 'События',
    description: ['Узнайте, что и где происходит. Планируйте мероприятия своего объединения'],
    icon: 'group',
  },
  {
    id: '2',
    label: 'документы и магазин',
    description: ['Актуальные листовки, документы и сувенирная продукция для участников объединения'],
    icon: 'group',
  },
];

type INextStepsProps = {
  type: 'profile' | 'alliance';
};

export function NextSteps({ type }: INextStepsProps) {
  let steps;

  switch (type) {
    case 'profile': {
      steps = profileSteps;
      break;
    }
    case 'alliance': {
      steps = allianceSteps;
      break;
    }
  }

  return (
    <div className={`${styles.NextSteps} p-left-md p-right-md`}>
      <h2 className="p-left p-0-left-md p-right p-0-right-md">В ближайшее время мы реализуем:</h2>
      <div className={styles.container}>
        {steps.map((nextStep) => (
          <div className={`${styles.nextStep}`} key={nextStep.id}>
            <div className={styles.icon}>
              <Icon iconName={nextStep.icon} />
            </div>
            <h3 className={styles.label}>{nextStep.label}</h3>
            <div className={`${styles.content} ${nextStep.description.length === 1 ? styles.withPadding : ''}`}>
              <div className={styles.description}>
                {nextStep.description.map((descriptionItem) => (
                  <p key={descriptionItem}>{descriptionItem}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
