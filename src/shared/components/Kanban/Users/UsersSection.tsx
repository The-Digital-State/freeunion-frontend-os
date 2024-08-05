import type { FC } from 'react';
import Section from '../Section/Section';
import UsersAvatar from './UsersAvatar/UsersAvatar';
import { UserShort } from 'shared/interfaces/user';

interface Props {
  users: UserShort[];
  cardId: string;
  onUsersDetach: (users: UserShort[]) => void;
  orgId: string;
}

const UsersSection: FC<Props> = ({ users, cardId, onUsersDetach, orgId }) => {
  if (users.length === 0) return null;
  return (
    <Section title="Участники" actions={null}>
      <div style={{ display: 'flex' }}>
        {users.map((user) => (
          <UsersAvatar user={user} cardId={cardId} orgId={orgId} onUsersDetach={onUsersDetach}></UsersAvatar>
        ))}
      </div>
    </Section>
  );
};

export default UsersSection;
