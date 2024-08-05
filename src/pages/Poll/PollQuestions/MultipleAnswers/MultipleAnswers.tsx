import { useMemo } from 'react';
import { Select } from 'shared/components/common/Select/Select';
import { AnswerProps } from '../PollQuestions';
import styles from './MultipleAnswers.module.scss';

const MultipleAnswers = ({ answersVariat, answer, setAnswer }: AnswerProps) => {
  let answersVariatOptions = useMemo(() => {
    return answersVariat.map((variant, index) => {
      return { label: variant, id: index };
    });
  }, [answersVariat]);

  return (
    <div className={styles.wrapper}>
      <p>Вы можете выбрать несколько вариантов ответа</p>
      <Select multiselect options={answersVariatOptions} alwaysOpen onSelect={(value) => setAnswer(value)} value={answer} />
    </div>
  );
};

export default MultipleAnswers;
