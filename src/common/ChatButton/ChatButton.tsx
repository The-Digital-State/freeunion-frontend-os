import { Button } from 'shared/components/common/Button/Button';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { useContext } from 'react';
import { GlobalContext } from 'contexts/GlobalContext';
import ExternalChatsModal from 'common/ExternalChatsModal/ExternalChatsModal';
import { useHistory } from 'react-router-dom';
import { routes } from 'Routes';

export const handleChatClick = async (selectedOrganisation, updateUnionActions, openModal) => {
  if (!!selectedOrganisation.chats.length) {
    openModal({
      params: {
        mainContainer: <ExternalChatsModal />,
      },
    });
    return;
  }
};

const ChatButton = ({ organisationId }: { organisationId?: number }) => {
  const history = useHistory();
  const { selectedOrganisation, updateUnionActions } = useContext(GlobalDataContext);
  const { openModal } = useContext(GlobalContext);

  return (
    <Button
      icon="message"
      color="light"
      onClick={() => {
        if (!selectedOrganisation?.chats?.length || !!organisationId) {
          history.push(`${routes.chat}?id=${!!organisationId ? organisationId : selectedOrganisation.id}&type=organization`);
        } else {
          handleChatClick(selectedOrganisation, updateUnionActions, openModal);
        }
      }}
    >
      {organisationId || !selectedOrganisation?.chats?.length ? 'Чат объединения' : 'Чаты объединения'}
    </Button>
  );
};

export default ChatButton;
