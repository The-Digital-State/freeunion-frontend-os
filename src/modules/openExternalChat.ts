import { IOrganisation } from 'interfaces/organisation.interface';
import { UnionActionsKeys } from 'interfaces/user.interface';
import { toast } from 'react-toastify';
import { organisationsService } from 'services';
import { ExternalChat } from 'shared/interfaces/externalChats';
import formatServerError from 'shared/utils/formatServerError';

type OpenChatTypes = {
  chat: ExternalChat;
  selectedOrganisation: IOrganisation;
  updateUnionActions: (id: number, key: string, value: boolean) => void;
  closeModal?: () => void;
};

export const openExternalChat = async ({ chat, selectedOrganisation, updateUnionActions, closeModal }: OpenChatTypes) => {
  let link = chat.value;
  if (chat.need_get) {
    try {
      const chatData = await organisationsService.getChat(selectedOrganisation.id, chat.id);

      if (!chatData.link) {
        throw Error('Ссылка не получена');
      }

      link = chatData.link;
    } catch (error) {
      toast.error(formatServerError(error));
      return;
    }
  }

  window.open(link, '_blank');
  updateUnionActions(+selectedOrganisation.id, UnionActionsKeys.joinChat, true);

  if (closeModal) {
    closeModal();
  }
};
