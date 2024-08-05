import { GlobalContext } from 'contexts/GlobalContext';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { openExternalChat } from 'modules/openExternalChat';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { routes } from 'Routes';
import { Button } from 'shared/components/common/Button/Button';
import styles from './ExternalChatsModal.module.scss';

const ExternalChatsModal = () => {
  const { selectedOrganisation, updateUnionActions } = useContext(GlobalDataContext);
  const { closeModal } = useContext(GlobalContext);
  const history = useHistory();

  return (
    <div className={styles.wrapper}>
      <h3>Чаты {selectedOrganisation.name}</h3>
      <ul className={styles.chats}>
        <li>
          <Button
            onClick={() => {
              history.push(`${routes.chat}?id=${selectedOrganisation.id}&type=organization`);
              closeModal();
            }}
            maxWidth
          >
            Написать организации
          </Button>
        </li>
        {selectedOrganisation.chats.map((chat) => {
          return (
            <li>
              <Button
                color="light"
                onClick={() => openExternalChat({ chat, selectedOrganisation, updateUnionActions, closeModal })}
                maxWidth
              >
                {chat.name}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ExternalChatsModal;
