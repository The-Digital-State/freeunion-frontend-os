export enum ExternalChatTypes {
  SimpleExternalChat = 0,
  IncognioChat = 1,
}

export type ExternalChat = {
  id: number;
  need_get?: boolean;
  type: ExternalChatTypes;
  value: string;
  name: string;
};
