import { useEffect, useRef, useState } from 'react';
import styles from './UsersModal.module.scss';
import { useSelector, useDispatch } from '../../../../redux';
import { Input } from 'shared/components/common/Input/Input';
import { CustomImage } from '../CustomImage/CustomImage';
import { ReactComponent as ChatIcon } from 'shared/icons/messages.svg';
import { ChatModalProps } from 'shared/interfaces/chat';
import { createThread } from 'shared/slices/chat';

interface UsersModalProps {
  modalProps: ChatModalProps
}
function UsersModal({ modalProps }: UsersModalProps) {
  const ref = useRef(null);
  const organizationId = useSelector((state) => state.chat.organizationId);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {

    (async () => {
      if (modalProps && modalProps.getOrganizationUsers && organizationId) {
        const { data } = await modalProps.getOrganizationUsers({ organizationId });
        setUsers(data)
      }
    })();
  }, [organizationId])

  const handleSearchChange = (value) => {
    setSearchQuery(value)
  }
  const filteredUsers = searchQuery ? users.filter(({ firstName, lastName }) => `${firstName} ${lastName}`.toLowerCase().includes(searchQuery.toLowerCase())) : users 
  return (
      <div className={styles.wrapper} ref={ref}>
          <div className={styles.inputWrapper}>
            <Input valueChange={handleSearchChange} placeholder={'Поиск'} value={searchQuery} />
          </div>
          <ul className='custom-scroll'>
            {filteredUsers.map(({ id, firstName, lastName, avatar, canConversation }) => {
              return (
                <li key={id} onClick={() => {
                  if (canConversation) {
                    dispatch(createThread(id, 'user'))
                    modalProps.closeModal();
                  }
                }}>
                  <div>
                    {/* <Checkbox isSquare value={!!values[id]} valueChange={(value) => {
                      if (value) {
                        setValues([...values, id])
                      } else {
                        const newValues = values.filter(key => key !== id);
                        setValues(newValues)

                      }
                    }
                    } name={`${id}`} /> */}
                    <CustomImage rounded={true} src={avatar}
                      width={60}
                      height={60}
                      alt=""
                    />
                    <h5>
                      <strong>{`${firstName} ${lastName}`}</strong>
                    </h5>
                  </div>
                  {canConversation && <ChatIcon />}
                </li>
              );
            })}
          </ul>
      </div>
  );
}
export default UsersModal;
