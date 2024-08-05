import { Radio } from 'shared/components/common/Radio/Radio';
import { useMemo } from 'react';
import styles from './OneAnswer.module.scss';
import { AnswerProps } from '../PollQuestions';

const OneAnswer = ({ answersVariat, answer, setAnswer }: AnswerProps) => {
  let answersVariatOptions = useMemo(() => {
    return answersVariat.map((variant, index) => {
      return { label: variant, id: index };
    });
  }, [answersVariat]);

  return (
    <div className={styles.wrapper}>
      <p>Выберите один вариант ответа</p>
      <Radio value={answer} valueChange={(value) => setAnswer(value)} options={answersVariatOptions} />
    </div>
  );
};

export default OneAnswer;
