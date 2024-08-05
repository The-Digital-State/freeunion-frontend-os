import { api } from './helper';

export function createConversation(conversationData: any) {
  return api().post(`/me/conversations`, conversationData);
}

export function getConversations() {
  return api().get(`/me/conversations`);
}
export function deleteConversation(id: string) {
  return api().delete(`/me/conversations/${id}`);
}
export function createMessage(id, messageData: any) {
  return api().post(`/me/conversations/${id}/messages`, messageData);
}
export function getMessages(id) {
  return api().get(`/me/conversations/${id}/messages`);
}
export function deleteMessage(id, messageId) {
  return api().delete(`/me/conversations/${id}/messages/${messageId}`);
}

export function createOrgConversation(conversationData: any, orgId) {
  return api().post(`/admin_org/${orgId}/conversations`, conversationData);
}

export function getOrgConversations(orgId) {
  return api().get(`/admin_org/${orgId}/conversations`);
}
export function deleteOrgConversation(id: string, orgId: string) {
  return api().delete(`/admin_org/${orgId}/conversations/${id}`);
}
export function createOrgMessage(id, messageData: any, orgId) {
  return api().post(`/admin_org/${orgId}/conversations/${id}/messages`, messageData);
}
export function getOrgMessages(id, orgId: string) {
  return api().get(`/admin_org/${orgId}/conversations/${id}/messages`);
}
export function deleteOrgMessage(id, messageId, orgId: string) {
  return api().delete(`/admin_org/${orgId}/conversations/${id}/messages/${messageId}`);
}

export function blockConversation(id: string) {
  return api().post(`/api/me/conversations/${id}/block`, {});
}

export function blockOrgConversation(orgId: string, conversationId: string) {
  return api().post(`/admin_org/${orgId}/conversations/${conversationId}/block`, {});
}

export function unBlockConversation(id: string) {
  return api().post(`/me/conversations/${id}/unblock`, {});
}

export function unBlockOrgConversation(orgId: string, conversationId: string) {
  return api().post(`/admin_org/${orgId}/conversations/${conversationId}/unblock`, {});
}
export function clearConversation(id: string) {
  return api().post(`/me/conversations/${id}/clear`, {});
}

export function clearOrgConversation(orgId: string, conversationId: string) {
  return api().post(`/admin_org/${orgId}/conversations/${conversationId}/clear`, {});
}

export function muteConversation(id: string) {
  return api().post(`/me/conversations/${id}/mute`, {});
}

export function muteOrgConversation(orgId: string, conversationId: string) {
  return api().post(`/admin_org/${orgId}/conversations/${conversationId}/mute`, {});
}

export function unmuteConversation(id: string) {
  return api().post(`/me/conversations/${id}/unmute`, {});
}

export function unmuteOrgConversation(orgId: string, conversationId: string) {
  return api().post(`/admin_org/${orgId}/conversations/${conversationId}/unmute`, {});
}

export function updateSettings(mode: string | number, list: string[]) {
  return api().post(`/me/settings`, {
    chats: { mode, list },
  });
}

export function updateMessage(id, messageId, messageData: any) {
  return api().put(`/me/conversations/${id}/messages/${messageId}`, messageData);
}
export function updateOrgMessage(id, messageId, messageData: any, orgId) {
  return api().put(`/admin_org/${orgId}/conversations/${id}/messages/${messageId}`, messageData);
}
