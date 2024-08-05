import { CustomImage } from 'common/CustomImage/CustomImage';
import { IOrganisation } from 'interfaces/organisation.interface';

import styles from './NoMoreSuggestions.module.scss';

type INoMoreSuggestionsProps = {
  organisation: IOrganisation;
  setSuggestionBlockStatus: (status: boolean) => void;
};

export function NoMoreSuggestions({ organisation, setSuggestionBlockStatus }: INoMoreSuggestionsProps) {
  return (
    <div className={styles.NoMoreSuggestions}>
      <div className={styles.content}>
        <h3>Проявите инициативу, предложите своему объединению что-то, что продвинет всех вас вперед к целям группы и общим целям</h3>
        <div className={styles.organisationAvatar}>
          <CustomImage
            src={organisation?.avatar}
            alt={organisation?.short_name}
            width={100}
            height={100}
            background={'white'}
            errorImage="noImage"
          />
        </div>
      </div>
    </div>
  );
}
