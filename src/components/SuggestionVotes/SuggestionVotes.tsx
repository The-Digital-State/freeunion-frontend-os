import { useContext, useState } from 'react';
import { SuggestionVotesVariant } from 'interfaces/suggestion.interface';
import { Button } from 'shared/components/common/Button/Button';
import { Icons } from 'shared/components/common/Icon/Icon.interface';
import styles from './SuggestionVotes.module.scss';
import { GlobalContext } from 'contexts/GlobalContext';
import { toast } from 'react-toastify';
import formatServerError from 'utils/formatServerError';
import SuggestionDoughnut from 'components/Suggestions/SuggestionDoughnut/SuggestionDoughnut';

const reactionButtons: { reaction: SuggestionVotesVariant; text: string; icon: keyof typeof Icons }[] = [
  {
    reaction: SuggestionVotesVariant.thumbs_up,
    text: 'За',
    icon: Icons.like,
  },
  {
    reaction: SuggestionVotesVariant.thumbs_down,
    text: 'Против',
    icon: Icons.dislike,
  },
  {
    reaction: SuggestionVotesVariant.neutral_face,
    text: 'Воздержался',
    icon: Icons.circleClose,
  },
];

interface ISuggestionVotes {
  userReaction?: SuggestionVotesVariant;
  suggestionId: number;
  votes?: any;
  disable?: boolean;
}

const SuggestionVotes = ({ userReaction, suggestionId, votes, disable }: ISuggestionVotes): JSX.Element => {
  const {
    services: { suggestionsService },
    screen: { innerWidth },
  } = useContext(GlobalContext);

  const [suggestionVotes, setSuggestionVotes] = useState(votes);
  const [userVote, setUserVote] = useState<SuggestionVotesVariant | null>(userReaction);

  const updateReaction = async (reaction: SuggestionVotesVariant) => {
    try {
      const resp = await suggestionsService.react(suggestionId, reaction);
      setUserVote(reaction !== -1 ? reaction : null);
      setSuggestionVotes(resp.reactions);
      toast(reaction !== -1 ? 'Вы успешно проголосовали' : 'Вы убрали свой голос');
    } catch (e) {
      toast.error(formatServerError(e));
    }
  };

  return (
    <div className={styles.wrapperVotes}>
      <SuggestionDoughnut votes={suggestionVotes} />
      <div className={styles.buttonsWrapper}>
        {reactionButtons.map((button) => {
          return (
            <Button
              icon={button.icon}
              maxWidth={innerWidth < 650}
              color={!!userVote && button.reaction === userVote ? 'primary' : 'light'}
              onClick={async () => await updateReaction(button.reaction === userVote ? -1 : button.reaction)}
              disabled={disable}
            >
              {button.text}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestionVotes;
