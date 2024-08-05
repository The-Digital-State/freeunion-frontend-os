import { refreshWSToken } from 'shared/services/auth';
import Centrifuge from 'centrifuge';
import { addNewMessage } from 'shared/slices/chat';
import toastStyles from 'shared/styles/Toast.module.scss';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export enum NotificationTypes {
  organizationRejection = 'organization:reject',
  organizationKicked = 'organization:kick',
  announcement = 'announcement',
  chat = 'chat',
  taskNew = 'deskTask:new',
  newsNew = 'news:published',
  newsPublished = 'news:own',
  suggestionNew = 'suggestion:new',
  suggestionToWork = 'suggestion:work',

  // organizationRejection = 'organization:reject'
}

type OrganizationPayload = {
  organization_id: number;
};

type SuggestionPayload = {
  desk_task_id: number;
  organization_id: number;
  suggestion_id: number;
};

type NewsPayload = {
  news_id: number;
  organization_id: number;
};

export type NotificationTypesData = {
  [NotificationTypes.announcement]: {
    from_id: number;
    from_type: string;
  };
  [NotificationTypes.chat]: {
    conversation_id: number;
  };
  [NotificationTypes.taskNew]: {
    organization_id: number;
    desk_task_id: number;
  };

  organization: OrganizationPayload;
  suggestion: SuggestionPayload;
  news: NewsPayload;
};

export type Notification = {
  type: NotificationTypes;
  payload: {
    title: string;
    content: string;
    data: object; // don't know how to use ts here
  };
};

const centrifuge = new Centrifuge(`${process.env.REACT_APP_WS_URL}/connection/websocket`, {
  // refreshEndpoint: 'https://api.tradeunion.online/api/auth/ws_refresh',
  // refreshHeaders: {
  //   Authorization: `Bearer ${token}`,
  // },
  debug: process.env.NODE_ENV === 'development',
  async onRefresh(ctx, cb) {
    const response = await refreshWSToken();
    cb(response);
  },
});

function init(notificationToken) {
  centrifuge.setToken(notificationToken);

  centrifuge.on('connect', function (ctx) {
    console.log('connected', ctx);
  });

  centrifuge.on('disconnect', function (ctx) {
    console.log('disconnected', ctx);
  });

  centrifuge.connect();
}

function subscribe(userId: number, dispatch, getUrl: (type, data) => string | void) {
  centrifuge.subscribe(`notification#${userId}`, function (ctx: { data: Notification }) {
    console.debug('Received notification:', ctx.data.type, ctx.data.payload, new Date());

    const {
      type,
      payload: { title, content, data },
    } = ctx.data;
    let link;

    switch (type) {
      case NotificationTypes.chat: {
        dispatch(addNewMessage(ctx.data));
        return;
      }

      default: {
        link = getUrl(type, data);
      }
    }

    toast(() => {
      let Tag: string | Link = 'div';
      let props = {};

      if (link) {
        // @ts-ignore
        Tag = Link;
        // @ts-ignore
        props.to = link;
      }
      return (
        // @ts-ignore
        <Tag className={toastStyles.notification} {...props}>
          <h6>{title}</h6>
          <p dangerouslySetInnerHTML={{ __html: content }}></p>
        </Tag>
      );
    });
  });
}

function disconnect() {
  centrifuge.disconnect();
}

/* eslint-disable-next-line */
export default { init, disconnect, subscribe };
