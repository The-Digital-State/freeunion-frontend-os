import { Button } from 'shared/components/common/Button/Button';

import styles from './SuggestionButton.module.scss';

interface IHelpOffersProps {
  setSuggestionBlockStatus: (status: boolean) => void;
}

const SuggestionButton = ({ setSuggestionBlockStatus }: IHelpOffersProps): JSX.Element => {
  return (
    <div data-cy="suggestion-button" className={styles.wrapper}>
      <p>Предложи инициативу и заработай очки рейтинга своего объединения</p>

      <div className={styles.suggestionButton}>
        <Button maxWidth={true} icon="bulb" onClick={() => setSuggestionBlockStatus(true)}>
          Предложить
        </Button>
      </div>
    </div>
  );
};

export default SuggestionButton;
