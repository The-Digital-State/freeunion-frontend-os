import styles from './PollCard.module.scss';
import { routes } from 'Routes';
import pollMockImage from './image/section-mock.jpg';
import ItemCard from 'components/ItemCard/ItemCard';
import { PollFront } from 'shared/interfaces/polls';

const PollCard = ({ poll, organization_id, close }: { poll: PollFront; organization_id: number; close?: boolean }) => {
  return (
    <ItemCard
      innerContent={
        <>
          <h3>{poll.name}</h3>
          {poll.description && <span className={styles.descriptionSection}>{poll.description.slice(0, 100)}</span>}
        </>
      }
      className={styles.wrapper}
      targetRoute={!close ? routes.poll.getLink(organization_id, poll.id) : routes.closePoll.getLink(organization_id, poll.id)}
      image={poll.images[0]?.url || pollMockImage}
    />
  );
};

export default PollCard;
