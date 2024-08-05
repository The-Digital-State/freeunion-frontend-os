import { Input } from 'shared/components/common/Input/Input';
import styles from './TextAnswer.module.scss';
import { AnswerProps } from '../PollQuestions';

const TextAnswer = ({ answer, setAnswer }: AnswerProps) => {
  return (
    <div className={styles.wrapper}>
      <Input value={answer} valueChange={(value) => setAnswer(value)} label="Текстовый ответ" placeholder="Напишите ваш ответ" />
    </div>
  );
};

export default TextAnswer;
