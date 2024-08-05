import { UserShort } from 'shared/interfaces/user';
import { api } from './helper';

export type CardInfo = {
  id?: string;
  title?: string;
  checklist?: object | null;
  image?: string | null;
  images?: { id: string; image: string }[];
  can_self_assign?: boolean;
  description?: string;
  created_at?: string;
  column_id?: number;
  users?: UserShort[];
  user?: UserShort;
  visibility?: number;
  index?: number;
  is_urgent?: boolean;
};

export type Column = {
  id?: string;
  cards: CardInfo[];
  name: string;
};

export function createTask(orgId: string, taskData: CardInfo) {
  return api().post(`/admin_org/${orgId}/desk_tasks`, taskData);
}

export function getTasks(orgId: string) {
  return api().get(`/organizations/${orgId}/desk_tasks`);
}
export function getAdminTasks(orgId: string) {
  return api().get(`/admin_org/${orgId}/desk_tasks`);
}

export function getTask(orgId: string, taskId: string) {
  return api().get(`/admin_org/${orgId}/desk_tasks/${taskId}`);
}

// TODO: refactor front and admin requests
export function getOrgTask(orgId: string, taskId: string) {
  return api().get(`/organizations/${orgId}/desk_tasks/${taskId}`);
}

export function moveTask(orgId: string, taskId: string, columnId: string) {
  return api().post(`/admin_org/${orgId}/desk_tasks/${taskId}/move/${columnId}`);
}
export function dragTask(orgId: string, taskId: string, rowId: number) {
  return api().post(`/admin_org/${orgId}/desk_tasks/${taskId}/drag/${rowId}`);
}

export function getComments(orgId: string, taskId: string) {
  return api().get(`/admin_org/${orgId}/desk_tasks/${taskId}/desk_comments`);
}

export function getOrgComments(orgId: string, taskId: string) {
  return api().get(`/organizations/${orgId}/desk_tasks/${taskId}/desk_comments`);
}

export function addComment(orgId: string, taskId: string, comment: string) {
  return api().post(`/admin_org/${orgId}/desk_tasks/${taskId}/desk_comments`, { comment });
}

export function updateTask(orgId: string, taskId: string, taskData: CardInfo) {
  return api().put(`/admin_org/${orgId}/desk_tasks/${taskId}`, taskData);
}

export function assignMeTask(orgId: string, taskId: string) {
  return api().post(`/organizations/${orgId}/desk_tasks/${taskId}/assign`);
}

export function addImage(orgId: string, taskId: string, image: string | ArrayBuffer) {
  return api().post(`/admin_org/${orgId}/desk_tasks/${taskId}/image`, { image });
}

export function removeImage(orgId: string, taskId: string, imageId: string) {
  return api().delete(`/admin_org/${orgId}/desk_tasks/${taskId}/image/${imageId}`);
}

export function attachUsers(orgId: string, taskId: string, users: string[]) {
  return api().post(`/admin_org/${orgId}/desk_tasks/${taskId}/attach`, { users });
}

export function detachUsers(orgId: string, taskId: string, users: string[]) {
  return api().post(`/admin_org/${orgId}/desk_tasks/${taskId}/detach`, { users });
}

export function updateComment(orgId: string, taskId: string, commentId: string, comment: string) {
  return api().put(`/admin_org/${orgId}/desk_tasks/${taskId}/desk_comments/${commentId}`, { comment });
}

export function removeComment(orgId: string, taskId: string, commentId: string) {
  return api().delete(`/admin_org/${orgId}/desk_tasks/${taskId}/desk_comments/${commentId}`);
}

export function getColumnTasks(orgId: string, columnId: string) {
  return api().get(`/organizations/${orgId}/desk_tasks?column=${columnId}`);
}
export function getAdminColumn(orgId: string, columnId: string) {
  return api().get(`/admin_org/${orgId}/desk_tasks?column=${columnId}`);
}
