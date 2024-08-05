import styles from './Suggestion.module.scss';

import { useContext, useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import { format } from 'date-fns';
// import ru from 'date-fns/locale/ru';

import { GlobalContext } from 'contexts/GlobalContext';
// import { Checkbox } from 'shared/components/common/Checkbox/Checkbox';
// import { CustomImage } from 'common/CustomImage/CustomImage';
// import { StepsProgressBar } from 'common/StepsProgressBar/StepsProgressBar';
// import { Button } from 'shared/components/common/Button/Button';
import { Helmet } from 'react-helmet';

// import Tooltip from 'shared/components/common/Tooltip/Tooltip';
import CreaterBlock from 'common/CreaterBlock/CreaterBlock';
import generalStyles from '../NewsDetails/NewsDetails.module.scss';
import { Slider } from 'common/Slider/Slider';
import { SimpleRoutingContainer } from 'common/Routing/SimpleRoutingContainer/SimpleRoutingContainer';
import { ISuggestion } from 'interfaces/suggestion.interface';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import { useParams } from 'react-router-dom';
import { SuggestionDescription } from 'components/Suggestions/SuggestionDescription/SuggestionDescription';
import SuggestionVotes from 'components/SuggestionVotes/SuggestionVotes';
import { routes } from 'Routes';
import Comments from 'shared/components/Comments/Comments';
import { GlobalDataContext } from 'contexts/GlobalDataContext';

export function Suggestion() {
  const {
    openModal,
    services: { suggestionsService },
  } = useContext(GlobalContext);
  const { user } = useContext(GlobalDataContext);

  const { organizationId, suggestionId } = useParams<{ organizationId: string; suggestionId: string }>();

  const [suggestion, setSuggestion] = useState<ISuggestion>();

  useEffect(() => {
    (async () => {
      try {
        const suggestion = await suggestionsService.getSuggestion(+organizationId, +suggestionId);
        setSuggestion(suggestion);
      } catch (e) {
        toast.error(formatServerError(e));
      }
    })();
  }, [organizationId, suggestionId]);

  if (!suggestion || !suggestion.created_at) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{suggestion.title}</title>
        <meta name="og:title" content={suggestion.title} />
        <meta
          name="og:image"
          content={
            !!suggestion.images.length
              ? suggestion.images[0].url
              : process.env.REACT_APP_BASE_URL + '/' + require('../../public/logo.jpg').default
          }
        />
      </Helmet>
      <SimpleRoutingContainer
        showCloseButton
        logo={{ src: suggestion?.organization?.avatar, alt: suggestion?.organization?.short_name }}
        title={suggestion?.organization?.short_name || suggestion?.organization?.name}
        hideFooter
        showScrollToTopButton
        className={generalStyles.main}
        closeButtonRoute={routes.union.getLink(suggestion?.organization?.id)}
      >
        <div className={generalStyles.wrapper}>
          <div className={generalStyles.titleWrapper}>
            <h2 className={generalStyles.title}>{suggestion.title}</h2>
            <p className={generalStyles.sectionTitle}>Предложение {!!suggestion.is_closed && '(Архив)'}</p>
          </div>
          <div className={generalStyles.createrWrapper}>
            <CreaterBlock user={suggestion.user} published_at={suggestion.created_at} />
          </div>
          <div className={generalStyles.contentWrapper}>
            <div>
              {suggestion.description ? (
                <SuggestionDescription suggestion={suggestion} fullDesription styles={styles} />
              ) : (
                <p>Описания нет</p>
              )}
            </div>

            {!!suggestion.images?.length && (
              <Slider
                slidesOnPage={1}
                controlsVerticalOffset={0}
                controlsHorizontalOffset={0}
                children={suggestion.images.map((image) => (
                  <div className={styles.imageWrapper}>
                    <img
                      src={image.url}
                      alt={suggestion.title}
                      onClick={(e) =>
                        openModal({
                          params: {
                            mainContainer: <img src={image.url} alt={suggestion.title} />,
                          },
                        })
                      }
                    />
                  </div>
                ))}
              />
            )}
            {/* {task.users?.length > 0 && (
          <div className={styles.section}>
            <p>Участники:</p>
            <div className={styles.avatarGroup}>
              {task.users.map((user) => {
                const userName = `${user.public_name} ${user.public_family}`;
                return (
                  <>
                    <div className={styles.avatar} data-tip data-for={`userTaskTooltip${user.id}`}>
                      <CustomImage src={user?.public_avatar || ''} alt={userName} width={37.5} height={37.5} />
                    </div>
                    <Tooltip title={userName} id={`userTaskTooltip${user.id}`} />
                  </>
                );
              })}
            </div>
          </div>
        )} */}
            <div className={styles.votesWrapper}>
              <h3>Голосование</h3>
              <SuggestionVotes
                userReaction={suggestion.my_reaction}
                suggestionId={suggestion.id}
                votes={suggestion.reactions}
                disable={suggestion.is_closed}
              />
            </div>
            <Comments name="suggestions" user={user} essenceId={suggestionId} disable={suggestion.is_closed} />
          </div>
        </div>
      </SimpleRoutingContainer>
    </>
  );
}
