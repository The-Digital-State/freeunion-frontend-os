import { useState } from 'react';
import ChatThreadList from '../ChatThreadList';
import styles from './ChatSidebar.module.scss';
import { ReactComponent as AddIcon } from '../../../icons/add-circle.svg';
import { ReactComponent as SettingIcon } from '../../../icons/setting-ring.svg';
import Settings from '../Settings/Settings';
import { Input } from 'shared/components/common/Input/Input';
import UsersModal from '../UsersModal/UsersModal';
import { useDispatch, useSelector } from '../../../../redux';
import { setSearchQuery } from 'shared/slices/chat';
import { ChatModalProps } from 'shared/interfaces/chat';
import { Spinner } from 'shared/components/common/Spinner/Spinner';
import classNames from 'classnames';

interface ChatSidebarProps {
  modalProps: ChatModalProps;
}
const ChatSidebar = ({
  modalProps
}: ChatSidebarProps) => {
  const dispatch = useDispatch();
  const [isSettingModalOpened, setIsSettingModalOpened] = useState(false);
  const searchQuery = useSelector(state => state.chat.searchQuery);
  const organizationId = useSelector(state => state.chat.organizationId);
  const isThreadsLoaded = useSelector(state => state.chat.isThreadsLoaded);

  const handleSearchChange = async (value): Promise<void> => {
    dispatch(setSearchQuery(value));
  };
  if (isSettingModalOpened) {
    return (
      <div className={styles.ChatSidebarContainer}>
        <Settings setIsSettingModalOpened={setIsSettingModalOpened} />
      </div>
    );
  }
  return (
    <div className={styles.ChatSidebarContainer}>
      <div className={styles.ChatSidebarHeader}>
        <div>
          <h3>Чаты</h3>
          <div className={styles.Icons}>
            {organizationId && <button
              className={styles.Icon}
              onClick={(ev) => {
                ev.stopPropagation();
                if (organizationId) {
                  modalProps.openModal(<UsersModal modalProps={modalProps} />, { title: 'ВСЕ УЧАСТНИКИ' });
                } else {
                  modalProps.openModal({ params: { mainContainer: <UsersModal modalProps={modalProps} /> } });
                }
              }}
            >
              <AddIcon />
            </button>}
            <button className={styles.Icon} onClick={() => setIsSettingModalOpened(true)}>
              <SettingIcon />
            </button>
          </div>
        </div>
        <Input valueChange={handleSearchChange} placeholder={'Поиск'} value={searchQuery} />
      </div>

      <div className={classNames(styles.ChatSidebarContent, { [styles.spinner]: !isThreadsLoaded})}>
        {isThreadsLoaded ? <ChatThreadList /> : <Spinner />}
      </div>
    </div>
  );
};

export default ChatSidebar;
