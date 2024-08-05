import styles from './GiveSuggestion.module.scss';

type IGiveSuggestionProps = {
  setSuggestionBlockStatus: (status: boolean) => void;
};

export function GiveSuggestion({ setSuggestionBlockStatus }: IGiveSuggestionProps) {
  return (
    <div className={styles.GiveSuggestion}>
      <h3>Проявите инициативу, предложите своему объединению что-то, что продвинет всех вас вперед к целям группы и общим целям</h3>
    </div>
  );
}
