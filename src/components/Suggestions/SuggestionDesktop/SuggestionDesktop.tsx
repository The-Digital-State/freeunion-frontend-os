import React from 'react';
import cn from 'classnames';

import styles from './SuggestionDesktop.module.scss';
import { ISuggestion } from '../../../interfaces/suggestion.interface';
import { CustomImage } from '../../../common/CustomImage/CustomImage';
import { SuggestionDescription } from '../SuggestionDescription/SuggestionDescription';
import { Button } from 'shared/components/common/Button/Button';
import { routes } from 'Routes';
import SuggestionDoughnut from '../SuggestionDoughnut/SuggestionDoughnut';

type ISuggestionDesktopProps = {
  suggestion: ISuggestion;
  setSuggestionBlockStatus: (status: boolean) => void;
  setSuggestionEdit?: (suggestion: ISuggestion) => void;
  deleteSuggestion: (suggestionId: ISuggestion) => void;
  setHoveredSuggestion: (suggestionId: ISuggestion) => void;
};
export function SuggestionDesktop({
  suggestion,
  setSuggestionBlockStatus,
  setSuggestionEdit,
  deleteSuggestion,
  setHoveredSuggestion,
}: ISuggestionDesktopProps) {
  return (
    <div className={styles.SuggestionDesktop}>
      <div className={cn(styles.suggestionTextWrapper, 'custom-scroll custom-scroll-black')}>
        <div className={styles.titleAvatarWrapper}>
          <div className={styles.avatar}>
            <CustomImage rounded={true} src={suggestion?.user?.public_avatar} height={60} width={60} alt="User Avatar" />
          </div>
          <h3 className={styles.title}>{suggestion?.title}</h3>
        </div>
        <p style={{ color: '#828ecc' }}>Обсуждений: {suggestion?.comments_count}</p>
        <div className={styles.wrapperDesctiptionDoug}>
          <SuggestionDescription suggestion={suggestion} styles={styles} />
          {!!suggestion?.reactions && <SuggestionDoughnut votes={suggestion?.reactions} withoutLabel />}
        </div>
      </div>
      <div className={styles.footer}>
        <Button color="light" to={routes.suggestion.getLink(suggestion?.organization_id, suggestion?.id)} className={styles.buttonMore}>
          Подробнее
        </Button>
        {suggestion?.owner && (
          <div className={styles.changeButton}>
            <button
              onClick={() => {
                setSuggestionBlockStatus(true);
                setSuggestionEdit(suggestion);
              }}
            >
              Изменить
            </button>
            <button
              onClick={() => {
                const isDelete = window.confirm(`Вы действительно хотите удалить предложение "${suggestion.title}"?`);
                if (isDelete) {
                  deleteSuggestion(suggestion);
                }
                setHoveredSuggestion(null);
              }}
            >
              Удалить
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
