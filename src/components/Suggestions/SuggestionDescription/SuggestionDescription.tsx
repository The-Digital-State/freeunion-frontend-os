import { ISuggestion } from 'interfaces/suggestion.interface';
import cn from 'classnames';
import sanitizeHtml from 'sanitize-html';
import style from './SuggestionDescription.module.scss';
import { allowedTagsSynitizer } from 'shared/constants/allowedTagsSynitizer';

interface ISuggestionDescription {
  suggestion: ISuggestion;
  styles?: any;
  fullDesription?: boolean;
}

export function SuggestionDescription({ suggestion, styles, fullDesription = false }: ISuggestionDescription): JSX.Element {
  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(suggestion?.description, {
            allowedTags: allowedTagsSynitizer,
          }),
        }}
        className={cn(style.fullDescription, {
          [style.shortDescription]: !fullDesription,
        })}
      />
      {!!fullDesription && (
        <>
          {suggestion?.solution && (
            <div className={style.additional}>
              <h4>Что сделать?</h4>
              <span>{suggestion.solution}</span>
            </div>
          )}
          {suggestion?.goal && (
            <div className={style.additional}>
              <h4>Это поможет</h4>
              <span className={styles.goalDescription}>{suggestion.goal}</span>
            </div>
          )}
          {suggestion?.urgency && (
            <div className={style.additional}>
              <h4>Срочно!</h4>
              <span>{suggestion.urgency}</span>
            </div>
          )}
          {suggestion?.budget && (
            <div className={style.additional}>
              <h4>Нужны деньги.</h4>
              <span>{suggestion?.budget}</span>
            </div>
          )}
          {suggestion?.legal_aid && (
            <div className={style.additional}>
              <h4>Нужна юридическая помощь.</h4>
              <span>{suggestion?.legal_aid}</span>
            </div>
          )}
          {suggestion?.rights_violation && (
            <div className={style.additional}>
              <h4>Нарушение прав.</h4>
              <span>{suggestion?.rights_violation}</span>
            </div>
          )}
        </>
      )}
    </>
  );
}
