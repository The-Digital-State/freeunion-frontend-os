import styles from './PollQuestions.module.scss';
import { useEffect, useState, useContext, useRef } from 'react';
import { showOrAnswerQuestion } from 'services/polls';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import { PollQuestionType, QuestionsTypesBack } from 'shared/interfaces/polls';
import { GlobalContext } from 'contexts/GlobalContext';
import OneAnswer from './OneAnswer/OneAnswer';
import MultipleAnswers from './MultipleAnswers/MultipleAnswers';
import TextAnswer from './TextAnswer/TextAnswer';
import ScaleAnswer from './ScaleAnswer/ScaleAnswer';
import { Button } from 'shared/components/common/Button/Button';

//const typeText = ['Один вариант ответа', 'Несколько варинтов ответа', 'Текстовый ответ', 'Шкала'];

export interface AnswerProps {
  answersVariat?: string[];
  answer: any;
  setAnswer: (e) => void;
  settings?: {
    answers?: string[];
    right_answer?: number | number[];
    min_value?: string;
    min_name?: string;
    max_value?: string;
    max_name?: string;
  };
}

const PollQuestions = ({ organizationId, pollId }: { organizationId: number; pollId: number }) => {
  const { openModal } = useContext(GlobalContext);

  const answerRef = useRef<HTMLInputElement>(null);

  const [answer, setAnswer] = useState(null);
  const [question, setQuestion] = useState<PollQuestionType>(null);
  const [meta, setMeta] = useState(null);
  const [pollCompleted, setPollCompleted] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const { data, ok, meta } = await showOrAnswerQuestion(+organizationId, +pollId);
        if (!!ok) {
          setPollCompleted(true);
          setQuestion(null);
          return;
        }
        if (data.type === QuestionsTypesBack.multiplyAnswers) {
          setAnswer([]);
        } else if (data.type === QuestionsTypesBack.textAnswer) {
          setAnswer('');
        } else {
          setAnswer(undefined);
        }
        setMeta(meta);
        setQuestion(data);
      } catch (e) {
        console.log(e);
        toast.error(formatServerError(e));
      }
    })();
  }, [pollId]);

  const submitQuestion = async (answer) => {
    try {
      const { data, ok, meta } = await showOrAnswerQuestion(+organizationId, +pollId, answer);
      if (!!ok) {
        setPollCompleted(true);
        setQuestion(null);
        return;
      }
      if (data.type === QuestionsTypesBack.multiplyAnswers) {
        setAnswer([]);
      } else if (data.type === QuestionsTypesBack.textAnswer) {
        setAnswer('');
      } else {
        setAnswer(undefined);
      }

      setMeta(meta);
      setQuestion(data);
      answerRef.current.scrollIntoView({
        behavior: 'smooth',
      });

      toast('Вопрос принят!');
    } catch (e) {
      console.log(e);
      toast.error(formatServerError(e));
    }
  };

  if (!question && !pollCompleted) {
    return null;
  }
  console.log(pollCompleted);

  return (
    <div className={styles.wrapper}>
      <div className={styles.questionTitleWrapper}>
        <p>Голосование</p>
      </div>
      {!pollCompleted ? (
        <div className={styles.wrapperQuestion} ref={answerRef}>
          <h2>{question.question}</h2>
          {!!question.image && (
            <div className={styles.imageWrapper}>
              <img
                src={question.image?.url}
                alt={question.question}
                onClick={(e) =>
                  openModal({
                    params: {
                      mainContainer: <img src={question.image.url} alt={question.question} />,
                    },
                  })
                }
              />
            </div>
          )}
          {(() => {
            switch (question.type) {
              case QuestionsTypesBack.oneAnswer:
                return <OneAnswer answersVariat={question.settings.answers} answer={answer} setAnswer={setAnswer} />;
              case QuestionsTypesBack.multiplyAnswers:
                return <MultipleAnswers answersVariat={question.settings.answers} answer={answer} setAnswer={setAnswer} />;
              case QuestionsTypesBack.textAnswer:
                return <TextAnswer answer={answer} setAnswer={setAnswer} />;
              case QuestionsTypesBack.scale:
                return <ScaleAnswer settings={question.settings} answer={answer} setAnswer={setAnswer} />;
              default:
                return <p>Ошибка, обновите страницу</p>;
            }
          })()}
          <div className={styles.wrapperButton}>
            <Button disabled={!answer && answer !== 0} onClick={() => submitQuestion(answer)}>
              {meta.current === meta.total ? 'Завершить опрос' : 'Следующий вопрос'}
            </Button>
            <span>
              {meta.current}/{meta.total}
            </span>
          </div>
        </div>
      ) : (
        <div className={styles.wrapperQuestion}>
          <h2 className={styles.completedPoll}>Вы успешно прошли опрос. Спасибо!</h2>
        </div>
      )}
    </div>
  );
};

export default PollQuestions;
