import { routes } from 'Routes';
import { NotificationTypes, NotificationTypesData } from 'shared/modules/sockets';

export const NOTIFICATION_LS_KEY = 'notification-popup-showed';

export function checkIfShowNotificationPopUp() {
  const lastDate = localStorage.getItem(NOTIFICATION_LS_KEY);

  if (lastDate) {
    return Date.now() - +lastDate >= 1000 * 60 * 60 * 24 * 7; // 1 week
  }

  return true;
}

export function getUrl(type: NotificationTypes, data: any) {
  let url;
  switch (type) {
    case NotificationTypes.organizationRejection: {
      url = routes.UNIONS;
      break;
    }

    case NotificationTypes.organizationKicked: {
      const { organization_id } = data as NotificationTypesData['organization'];
      url = routes.union.getLink(organization_id);
      break;
    }

    case NotificationTypes.chat: {
      const { conversation_id } = data as NotificationTypesData['chat'];
      url = routes.chat;

      if (conversation_id) {
        url += `?conversation_id=${conversation_id}`;
      }

      break;
    }

    case NotificationTypes.newsNew:
    case NotificationTypes.newsPublished: {
      const { organization_id, news_id } = data as NotificationTypesData['news'];
      url = routes.newsDetails.getLink(organization_id, news_id);
      break;
    }

    case NotificationTypes.taskNew: {
      const { organization_id, desk_task_id } = data as NotificationTypesData[NotificationTypes.taskNew];
      url = routes.task.getLink(organization_id, desk_task_id);
      break;
    }

    case NotificationTypes.announcement: {
      const { from_id } = data as NotificationTypesData[NotificationTypes.announcement];
      url = routes.union.getLink(from_id);
      break;
    }

    case NotificationTypes.suggestionNew: {
      const { organization_id } = data as NotificationTypesData['suggestion'];
      url = routes.union.getLink(organization_id);
      break;
    }

    case NotificationTypes.suggestionToWork: {
      const { desk_task_id, organization_id } = data as NotificationTypesData['suggestion'];
      url = routes.task.getLink(organization_id, desk_task_id);
      break;
    }
  }

  return url;
}
