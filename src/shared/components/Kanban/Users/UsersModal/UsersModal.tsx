import { useEffect, useRef, useState } from 'react';
import styles from './UsersModal.module.scss';
import { Input } from 'shared/components/common/Input/Input';
import { CustomImage } from 'shared/Chat/components/CustomImage/CustomImage';
import { useLocation } from 'react-router';
import { Checkbox } from 'shared/components/common/Checkbox/Checkbox';
import { Button } from 'shared/components/common/Button/Button';
import { OrganizationShort } from 'shared/interfaces/organization';
import { UserShort } from 'shared/interfaces/user';

interface UsersModalProps {
  getOrganizationUsers: (value: { organizationId?: string }) => Promise<{ data: OrganizationShort[] }>;
  onUsersSubmit: (users: number[]) => void;
  users: UserShort[];
}
function UsersModal({ getOrganizationUsers, onUsersSubmit, users: selectedUsers }: UsersModalProps) {
  const ref = useRef(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const organizationId = location.pathname.split('/')[1];
  const [values, setValues] = useState(selectedUsers.map(({ id }) => id));
  useEffect(() => {
    (async () => {
      if (getOrganizationUsers && organizationId) {
        const { data } = await getOrganizationUsers({ organizationId });
        setUsers(data);
      }
    })();
  }, [organizationId]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };
  const filteredUsers = searchQuery
    ? users.filter(({ firstName, lastName }) =>
        `${firstName} ${lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  return (
    <div className={`${styles.wrapper}`} ref={ref}>
      <div className={styles.header}>
        <div className={styles.inputWrapper}>
          <Input valueChange={handleSearchChange} placeholder={'Поиск'} value={searchQuery} />
        </div>
        <Button
          onClick={() => {
            onUsersSubmit(values);
          }}
        >
          Добавить
        </Button>
      </div>
      <ul>
        {filteredUsers.map(({ id, firstName, lastName, avatar }) => {
          return (
            <li key={id}>
              <Checkbox
                isSquare
                value={!!values.includes(id)}
                valueChange={(value) => {
                  if (value) {
                    setValues([...values, id]);
                  } else {
                    const newValues = values.filter((key) => key !== id);
                    setValues(newValues);
                  }
                }}
                name={`${id}`}
              />
              <CustomImage rounded={true} src={avatar} width={60} height={60} alt="" />
              <h5>
                <strong>{`${firstName} ${lastName}`}</strong>
              </h5>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
export default UsersModal;
