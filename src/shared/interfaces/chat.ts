import { ReactElement } from 'react';

export const CHAT_INPUT_ID = 'chat-message-add';

export type ChatModalProps = {
  openModal: (options?: object | ReactElement, settings?: { title: string }) => void;
  closeModal: () => void;
  getOrganizationUsers?: (value: { organizationId: number }) => Promise<{ data: object[], totalCount: number}>;
};
