import React, { useEffect, useState } from 'react';
import styles from './StepDataEncryption.module.scss';
import { PieProgress } from '../../../../common/PieProgres/PieProgress';
import { Icon } from '../../../../shared/components/common/Icon/Icon';
import { Button } from '../../../../shared/components/common/Button/Button';
import { useHistory } from 'react-router-dom';
import { REGISTRATION_PUBLIC_NAME_SS_KEY } from 'constans/storage';

type IStepDataEncryptionProps = {
  goNext: () => void;
};

let unblockFunc;

export function StepDataEncryption({ goNext }: IStepDataEncryptionProps) {
  const [progress, setProgress] = useState<number>(0);
  const [encryptionFinished, setEncryptionFinishedStatus] = useState<boolean>(false);
  const history = useHistory();

  const publicName = sessionStorage.getItem(REGISTRATION_PUBLIC_NAME_SS_KEY);

  useEffect(() => {
    unblockFunc = history.block();
  }, []);

  useEffect(() => {
    let timeoutId: number;

    if (progress < 100) {
      timeoutId = window.setTimeout(() => {
        setProgress(progress + 20);
      }, 500);
    } else {
      setTimeout(() => {
        setEncryptionFinishedStatus(true);
      }, 1000);
    }

    return () => {
      timeoutId && window.clearTimeout(timeoutId);
    };
  }, [progress, encryptionFinished]);

  return (
    <div className={styles.StepDataEncryption}>
      {encryptionFinished ? (
        <>
          <div className={styles.content}>
            <div className={styles.icon}>
              <Icon iconName={'logoSmall'} width={200} height={100} />
            </div>
            {publicName && <span className={styles.publicName}>Ваше новое имя: {publicName}</span>}

            <p>
              Спасибо за регистрацию, Ваши личные данные, в том числе ваше имя на платформе можно будет изменить в форме редактирования
              данных
            </p>
          </div>

          <div className={`${styles.actions} form-group form-actions`}>
            <Button
              onClick={() => {
                unblockFunc && unblockFunc();
                setTimeout(() => {
                  goNext();
                }, 100);
              }}
            >
              Далее
            </Button>
          </div>
        </>
      ) : (
        <div className={styles.content}>
          <div className={styles.icon}>
            <PieProgress progress={progress} />
          </div>
          <p>
            Шифруются ваши персональные данные. Мы генерируем имя, которым вы будете пользоваться на платформе. Произвольное имя помогает
            спрятать ваши данные полностью
          </p>
        </div>
      )}
    </div>
  );
}
