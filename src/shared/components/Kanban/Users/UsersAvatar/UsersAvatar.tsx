import type { FC } from 'react';
import { useState } from 'react';
import { detachUsers } from 'shared/services/tasks.service';
import styles from './Users.module.scss';
import { UserShort } from 'shared/interfaces/user';
import { CustomImage } from 'shared/Chat/components/CustomImage/CustomImage';
import buttonStyles from 'shared/components/common/Button/Button.module.scss';

interface Props {
  user: UserShort;
  cardId: string;
  onUsersDetach: (users: UserShort[]) => void;
  orgId: string;
}

const UsersAvatar: FC<Props> = ({ user, cardId, onUsersDetach, orgId }) => {
  const [hovered, setHovered] = useState<boolean>(false);


  return (
    <>
      <div className={styles.wrapper} onMouseLeave={() => setHovered(false)}>
        <div className={styles.imgWrapper} onMouseEnter={() => setHovered(true)}>
          <CustomImage key={user.id} src={user.public_avatar} width={40} height={40} alt="" />
        </div>

        <div
          style={{
            position: 'absolute',
            opacity: hovered ? 1 : 0,
            pointerEvents: hovered ? 'auto' : 'none',
            zIndex: 10,
            paddingTop: '6px',
            left: '50%',
            transform: 'translateX(-50%)',
            transition: 'opacity .25s',
          }}
        >
          <div
            style={{
              boxShadow: '0 0 5px 0 rgba(0, 0, 0, .15)',
              border: '1px solid lightgrey',
              borderRadius: '10px',
              padding: '10px 15px',
              backgroundColor: '#fff',
            }}
          >
            {`${user.public_name} ${user.public_family}`}
            <button
              onClick={async () => {
                const {
                  data: {
                    data: { users },
                  },
                } = await detachUsers(orgId, cardId, [String(user.id)]);
                onUsersDetach(users);
              }}
              className={buttonStyles.textButton}
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersAvatar;
