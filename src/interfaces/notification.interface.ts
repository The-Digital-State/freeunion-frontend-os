import { NotificationTypes } from 'shared/modules/sockets';

export interface Notification {
  id: number;
  from_type: number;
  from_id: number;
  from: {
    name: string;
    logo: string;
  };
  title: string;
  message: string;
  status: NotificationStatusEnum;
  created_at: string;
  type: NotificationTypes;
  data: any;
}

export enum NotificationStatusEnum {
  unread,
  read,
}
